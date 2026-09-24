import prisma from '../lib/prisma.js';

const errorResponse = (res, status, message) =>
  res.status(status).json({ error: true, message, status });

const cartInclude = {
  items: {
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'asc' },
  },
};

const getGuestCartId = (req) => req.headers['x-cart-id'] || req.query.cartId;

const formatCartResponse = (cart) => {
  const items = (cart.items || []).map((item) => {
    const price = typeof item.product.price === 'object'
      ? parseFloat(item.product.price.toString())
      : parseFloat(item.product.price);
    const itemSubtotal = parseFloat((price * item.quantity).toFixed(2));

    return {
      id: item.id,
      productId: item.productId,
      product: {
        id: item.product.id,
        title: item.product.title,
        price,
        image: item.product.image,
        category: item.product.category ? item.product.category.name : '',
        stock: item.product.stock,
      },
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });

  const subtotal = parseFloat(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  const tax = parseFloat((subtotal * 0.10).toFixed(2));
  const shipping = subtotal > 0 && subtotal < 100 ? 10.00 : 0.00;
  const total = parseFloat((subtotal + tax + shipping).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    items,
    itemCount,
    subtotal,
    tax,
    shipping,
    total,
    updatedAt: cart.updatedAt,
  };
};

const getOrCreateGuestCart = async (cartId) => {
  const normalizedId = typeof cartId === 'string' ? cartId.trim() : '';
  if (normalizedId) {
    const existing = await prisma.cart.findUnique({ where: { id: normalizedId }, include: cartInclude });
    if (existing) {
      if (existing.userId) {
        // Stale cart ID from a previous session — create a fresh guest cart instead of blocking
        return prisma.cart.create({ data: {}, include: cartInclude });
      }
      return existing;
    }
    return prisma.cart.create({ data: { id: normalizedId }, include: cartInclude });
  }
  return prisma.cart.create({ data: {}, include: cartInclude });
};

const getUserCart = async (userId) => {
  const existing = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId }, include: cartInclude });
};

const getRequestCart = async (req) => {
  if (req.user) return getUserCart(req.user.id);
  return getOrCreateGuestCart(getGuestCartId(req));
};

const refetchCart = (cartId) => prisma.cart.findUnique({
  where: { id: cartId },
  include: cartInclude,
});

const requireGuestCartIdForMutation = (req, res) => {
  if (!req.user && !getGuestCartId(req)) {
    errorResponse(res, 400, 'x-cart-id header or cartId query param is required.');
    return false;
  }
  return true;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getRequestCart(req);
    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const parsedProductId = Number.parseInt(req.body.productId, 10);
    const parsedQuantity = Number.parseInt(req.body.quantity ?? 1, 10);

    if (!Number.isInteger(parsedProductId) || parsedProductId < 1) {
      return errorResponse(res, 400, 'Invalid productId. Must be a positive integer.');
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return errorResponse(res, 400, 'Invalid quantity. Must be a positive integer.');
    }

    const product = await prisma.product.findUnique({ where: { id: parsedProductId } });
    if (!product) return errorResponse(res, 404, `Product with ID ${parsedProductId} not found.`);

    const cart = await getRequestCart(req);

    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: parsedProductId } },
      update: { quantity: { increment: parsedQuantity } },
      create: { cartId: cart.id, productId: parsedProductId, quantity: parsedQuantity },
    });

    res.status(200).json(formatCartResponse(await refetchCart(cart.id)));
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    if (!requireGuestCartIdForMutation(req, res)) return;
    const parsedProductId = Number.parseInt(req.params.productId, 10);
    const parsedQuantity = Number.parseInt(req.body.quantity, 10);
    if (!Number.isInteger(parsedProductId) || parsedProductId < 1) {
      return errorResponse(res, 400, 'Invalid productId. Must be a positive integer.');
    }
    if (!Number.isInteger(parsedQuantity)) {
      return errorResponse(res, 400, 'Quantity is required and must be an integer.');
    }

    const cart = await getRequestCart(req);
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: parsedProductId } },
    });
    if (parsedQuantity > 0 && !existingItem) {
      return errorResponse(res, 404, `Item with product ID ${parsedProductId} is not in the cart.`);
    }

    if (parsedQuantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: parsedProductId } });
    } else {
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId: parsedProductId } },
        data: { quantity: parsedQuantity },
      });
    }

    res.status(200).json(formatCartResponse(await refetchCart(cart.id)));
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    if (!requireGuestCartIdForMutation(req, res)) return;
    const parsedProductId = Number.parseInt(req.params.productId, 10);
    if (!Number.isInteger(parsedProductId) || parsedProductId < 1) {
      return errorResponse(res, 400, 'Invalid productId. Must be a positive integer.');
    }

    const cart = await getRequestCart(req);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: parsedProductId } });
    res.status(200).json(formatCartResponse(await refetchCart(cart.id)));
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    if (!requireGuestCartIdForMutation(req, res)) return;
    const cart = await getRequestCart(req);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    res.status(200).json(formatCartResponse(await refetchCart(cart.id)));
  } catch (error) {
    next(error);
  }
};
