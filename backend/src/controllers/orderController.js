import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';

class CheckoutError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const toNumber = (value) => Number(new Prisma.Decimal(value).toFixed(2));

const formatOrderResponse = (order) => ({
  id: order.id,
  status: order.status,
  customer: {
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    shippingAddress: order.shippingAddress,
  },
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    title: item.title,
    unitPrice: toNumber(item.unitPrice),
    quantity: item.quantity,
    lineTotal: toNumber(item.lineTotal),
  })),
  subtotal: toNumber(order.subtotal),
  tax: toNumber(order.tax),
  shipping: toNumber(order.shipping),
  total: toNumber(order.total),
  createdAt: order.createdAt,
});

const getCustomerDetails = (body = {}) => {
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const customerEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim().toLowerCase() : '';
  const customerPhone = typeof body.customerPhone === 'string' ? body.customerPhone.trim() : '';
  const shippingAddress = typeof body.shippingAddress === 'string' ? body.shippingAddress.trim() : '';

  if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
    throw new CheckoutError(400, 'Name, email, phone, and shipping address are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new CheckoutError(400, 'Please provide a valid email address.');
  }

  return { customerName, customerEmail, customerPhone, shippingAddress };
};

// POST /api/orders/checkout
// Prices and quantities always come from the database cart, never from the browser.
export const checkout = async (req, res, next) => {
  try {
    const cartId = typeof req.headers['x-cart-id'] === 'string'
      ? req.headers['x-cart-id'].trim()
      : '';
    if (!cartId) {
      throw new CheckoutError(400, 'x-cart-id header is required to place an order.');
    }

    const customer = getCustomerDetails(req.body);

    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!cart) throw new CheckoutError(404, 'Cart not found.');
      if (cart.items.length === 0) throw new CheckoutError(400, 'Cannot checkout an empty cart.');

      const orderItems = cart.items.map((item) => {
        if (!item.product) {
          throw new CheckoutError(409, `A product in your cart is no longer available.`);
        }

        const unitPrice = new Prisma.Decimal(item.product.price);
        const lineTotal = unitPrice.mul(item.quantity).toDecimalPlaces(2);
        return {
          productId: item.productId,
          title: item.product.title,
          unitPrice,
          quantity: item.quantity,
          lineTotal,
        };
      });

      // Conditional updates make stock deduction safe if two checkouts happen together.
      for (const item of orderItems) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count !== 1) {
          throw new CheckoutError(409, `Insufficient stock for "${item.title}".`);
        }
      }

      const subtotal = orderItems
        .reduce((sum, item) => sum.plus(item.lineTotal), new Prisma.Decimal(0))
        .toDecimalPlaces(2);
      const tax = subtotal.mul('0.10').toDecimalPlaces(2);
      const shipping = subtotal.gt(0) && subtotal.lt(100)
        ? new Prisma.Decimal(10)
        : new Prisma.Decimal(0);
      const total = subtotal.plus(tax).plus(shipping).toDecimalPlaces(2);

      const createdOrder = await tx.order.create({
        data: {
          cartId: cart.id,
          ...customer,
          subtotal,
          tax,
          shipping,
          total,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return createdOrder;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    res.status(201).json(formatOrderResponse(order));
  } catch (error) {
    next(error);
  }
};
