import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { BCRYPT_ROUNDS, JWT_EXPIRES_IN, JWT_SECRET } from '../config/auth.js';

const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  cart: { select: { id: true } },
};

export class AuthError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

const normalizeEmail = (value) => (
  typeof value === 'string' ? value.trim().toLowerCase() : ''
);

const validateCredentials = (body = {}) => {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    throw new AuthError(400, 'Email and password are required.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AuthError(400, 'Please provide a valid email address.');
  }

  return { name, email, password };
};

const toPublicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  cartId: user.cart?.id || null,
});

const signToken = (user) => jwt.sign(
  { sub: String(user.id), email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN },
);

const getUserWithCart = (db, userId) => db.user.findUnique({
  where: { id: userId },
  select: USER_PUBLIC_SELECT,
});

export const migrateGuestCart = async (tx, userId, guestCartId) => {
  const normalizedGuestCartId = typeof guestCartId === 'string' ? guestCartId.trim() : '';
  let userCart = await tx.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!userCart) {
    userCart = await tx.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  if (!normalizedGuestCartId || normalizedGuestCartId === userCart.id) return userCart;

  const guestCart = await tx.cart.findUnique({
    where: { id: normalizedGuestCartId },
    include: { items: true },
  });

  if (!guestCart) return userCart;
  if (guestCart.userId && guestCart.userId !== userId) {
    // Stale cart from another user's session — skip migration, don't block registration
    return userCart;
  }

  for (const item of guestCart.items) {
    await tx.cartItem.upsert({
      where: {
        cartId_productId: { cartId: userCart.id, productId: item.productId },
      },
      update: { quantity: { increment: item.quantity } },
      create: {
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    });
  }

  // A guest cart may already be referenced by historical guest orders.
  // Keep that cart as an immutable order anchor instead of violating Order.cartId RESTRICT.
  const historicalOrderCount = await tx.order.count({
    where: { cartId: guestCart.id },
  });

  if (historicalOrderCount > 0) {
    await tx.cartItem.deleteMany({ where: { cartId: guestCart.id } });
  } else {
    await tx.cart.delete({ where: { id: guestCart.id } });
  }
  return userCart;
};

const withRetry = async (operation, db = prisma) => {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await db.$transaction(operation, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      if (error?.code !== 'P2034' || attempt === 3) throw error;
    }
  }
  throw new AuthError(409, 'Authentication conflict detected. Please try again.');
};

export const register = async ({ name, email, password, guestCartId, db = prisma }) => {
  const credentials = validateCredentials({ name, email, password });
  if (!credentials.name) throw new AuthError(400, 'Name is required.');
  if (credentials.password.length < 8) {
    throw new AuthError(400, 'Password must be at least 8 characters long.');
  }

  const passwordHash = await bcrypt.hash(credentials.password, BCRYPT_ROUNDS);

  try {
    const user = await withRetry(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: credentials.name,
          email: credentials.email,
          passwordHash,
        },
        select: { id: true, email: true, role: true },
      });
      await migrateGuestCart(tx, createdUser.id, guestCartId);
      return getUserWithCart(tx, createdUser.id);
    }, db);

    return { token: signToken(user), user: toPublicUser(user) };
  } catch (error) {
    if (error?.code === 'P2002') throw new AuthError(409, 'An account with this email already exists.');
    throw error;
  }
};

export const login = async ({ email, password, guestCartId, db = prisma }) => {
  const credentials = validateCredentials({ email, password });
  const user = await db.user.findUnique({ where: { email: credentials.email } });

  if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
    throw new AuthError(401, 'Invalid email or password.');
  }

  const userWithCart = await withRetry(async (tx) => {
    await migrateGuestCart(tx, user.id, guestCartId);
    return getUserWithCart(tx, user.id);
  }, db);

  return { token: signToken(userWithCart), user: toPublicUser(userWithCart) };
};

export const getUserFromToken = async (token, db = prisma) => {
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new AuthError(401, 'Invalid or expired token.');
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || userId < 1) {
    throw new AuthError(401, 'Invalid or expired token.');
  }

  const user = await getUserWithCart(db, userId);
  if (!user) throw new AuthError(401, 'User no longer exists.');
  return toPublicUser(user);
};

export const publicUserSelect = USER_PUBLIC_SELECT;
