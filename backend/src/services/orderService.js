import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';

const TAX_RATE = new Prisma.Decimal('0.10');
const FREE_SHIPPING_THRESHOLD = new Prisma.Decimal('100');
const STANDARD_SHIPPING = new Prisma.Decimal('10');
const MAX_TRANSACTION_RETRIES = 3;

export class CheckoutError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'CheckoutError';
    this.statusCode = statusCode;
  }
}

const asMoney = (value) => new Prisma.Decimal(value).toDecimalPlaces(2);

export const toMoneyNumber = (value) => Number(asMoney(value).toString());

export const normalizeCartId = (value) => (
  typeof value === 'string' ? value.trim() : ''
);

export const getCustomerDetails = (body = {}) => {
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const customerEmail = typeof body.customerEmail === 'string'
    ? body.customerEmail.trim().toLowerCase()
    : '';
  const customerPhone = typeof body.customerPhone === 'string' ? body.customerPhone.trim() : '';
  const shippingAddress = typeof body.shippingAddress === 'string'
    ? body.shippingAddress.trim()
    : '';

  if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
    throw new CheckoutError(400, 'Name, email, phone, and shipping address are required.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new CheckoutError(400, 'Please provide a valid email address.');
  }

  return { customerName, customerEmail, customerPhone, shippingAddress };
};

export const calculateOrderTotals = (items) => {
  const subtotal = items
    .reduce((sum, item) => sum.plus(item.lineTotal), new Prisma.Decimal(0))
    .toDecimalPlaces(2);
  const tax = subtotal.mul(TAX_RATE).toDecimalPlaces(2);
  const shipping = subtotal.gt(0) && subtotal.lt(FREE_SHIPPING_THRESHOLD)
    ? STANDARD_SHIPPING
    : new Prisma.Decimal(0);
  const total = subtotal.plus(tax).plus(shipping).toDecimalPlaces(2);

  return { subtotal, tax, shipping, total };
};

const buildOrderItems = (cartItems) => cartItems.map((cartItem) => {
  const product = cartItem.product;
  const quantity = cartItem.quantity;

  if (!product) {
    throw new CheckoutError(409, 'A product in your cart is no longer available.');
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new CheckoutError(409, `Invalid quantity for "${product.title}".`);
  }

  const unitPrice = asMoney(product.price);
  const lineTotal = unitPrice.mul(quantity).toDecimalPlaces(2);

  return {
    productId: cartItem.productId,
    title: product.title,
    unitPrice,
    quantity,
    lineTotal,
  };
});

const createOrderInTransaction = async (tx, { cartId, userId }, customer) => {
  const cart = await tx.cart.findUnique({
    where: userId ? { userId } : { id: cartId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) throw new CheckoutError(404, 'Cart not found.');
  if (!userId && cart.userId) {
    throw new CheckoutError(403, 'This cart belongs to an authenticated user.');
  }
  if (cart.items.length === 0) throw new CheckoutError(400, 'Cannot checkout an empty cart.');

  const orderItems = buildOrderItems(cart.items);

  for (const item of orderItems) {
    const updated = await tx.product.updateMany({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });

    if (updated.count !== 1) {
      throw new CheckoutError(409, `Insufficient stock for "${item.title}".`);
    }
  }

  const totals = calculateOrderTotals(orderItems);
  const order = await tx.order.create({
    data: {
      cartId: cart.id,
      userId: userId || null,
      ...customer,
      ...totals,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  return order;
};

const isSerializationConflict = (error) => error?.code === 'P2034';

export const formatOrderResponse = (order) => ({
  id: order.id,
  status: order.status,
  customer: {
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    shippingAddress: order.shippingAddress,
  },
  items: (order.items || []).map((item) => ({
    id: item.id,
    productId: item.productId,
    title: item.title,
    unitPrice: toMoneyNumber(item.unitPrice),
    quantity: item.quantity,
    lineTotal: toMoneyNumber(item.lineTotal),
  })),
  subtotal: toMoneyNumber(order.subtotal),
  tax: toMoneyNumber(order.tax),
  shipping: toMoneyNumber(order.shipping),
  total: toMoneyNumber(order.total),
  createdAt: order.createdAt,
});

export const checkoutCart = async ({ cartId, userId, customer, db = prisma }) => {
  const normalizedCartId = normalizeCartId(cartId);
  if (!userId && !normalizedCartId) {
    throw new CheckoutError(400, 'x-cart-id header is required to place an order.');
  }

  const customerDetails = getCustomerDetails(customer);

  for (let attempt = 1; attempt <= MAX_TRANSACTION_RETRIES; attempt += 1) {
    try {
      const order = await db.$transaction(
        (tx) => createOrderInTransaction(tx, { cartId: normalizedCartId, userId }, customerDetails),
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      return formatOrderResponse(order);
    } catch (error) {
      if (!isSerializationConflict(error) || attempt === MAX_TRANSACTION_RETRIES) {
        if (isSerializationConflict(error)) {
          throw new CheckoutError(409, 'Checkout conflict detected. Please try again.');
        }
        throw error;
      }
    }
  }

  throw new CheckoutError(409, 'Checkout conflict detected. Please try again.');
};
