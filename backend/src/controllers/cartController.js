import prisma from '../lib/prisma.js';

// Standardized error response
const errorResponse = (res, status, message) =>
  res.status(status).json({ error: true, message, status });

// Calculate cart totals & format output
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
      },
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });

  const subtotal = parseFloat(
    items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
  );
  const tax = parseFloat((subtotal * 0.10).toFixed(2)); // 10% tax
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

// Helper: Get existing cart or create a new one
const getOrCreateCart = async (cartId) => {
  if (cartId && typeof cartId === 'string' && cartId.trim()) {
    const existing = await prisma.cart.findUnique({
      where: { id: cartId.trim() },
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (existing) return existing;

    // Create cart with explicit ID if valid string
    return prisma.cart.create({
      data: { id: cartId.trim() },
      include: {
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });
  }

  // Create new cart with auto UUID
  return prisma.cart.create({
    data: {},
    include: {
      items: {
        include: { product: { include: { category: true } } },
      },
    },
  });
};

// GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.query.cartId;
    const cart = await getOrCreateCart(cartId);
    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/items
export const addToCart = async (req, res, next) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.query.cartId;
    const { productId, quantity = 1 } = req.body;

    const parsedProductId = parseInt(productId, 10);
    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedProductId) || parsedProductId < 1) {
      return errorResponse(res, 400, 'Invalid productId. Must be a positive integer.');
    }
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return errorResponse(res, 400, 'Invalid quantity. Must be a positive integer.');
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: parsedProductId },
    });
    if (!product) {
      return errorResponse(res, 404, `Product with ID ${parsedProductId} not found.`);
    }

    const cart = await getOrCreateCart(cartId);

    // Upsert cart item
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parsedProductId,
        },
      },
      update: {
        quantity: { increment: parsedQuantity },
      },
      create: {
        cartId: cart.id,
        productId: parsedProductId,
        quantity: parsedQuantity,
      },
    });

    // Re-fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/cart/items/:productId
export const updateCartItem = async (req, res, next) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.query.cartId;
    const parsedProductId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;

    if (isNaN(parsedProductId) || parsedProductId < 1) {
      return errorResponse(res, 400, 'Invalid productId. Must be a positive integer.');
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      return errorResponse(res, 400, 'Quantity is required and must be an integer.');
    }

    if (!cartId) {
      return errorResponse(res, 400, 'x-cart-id header or cartId query param is required.');
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found.');
    }

    if (parsedQuantity <= 0) {
      // Delete item if quantity <= 0
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId: parsedProductId,
        },
      });
    } else {
      // Check if item exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: parsedProductId,
          },
        },
      });

      if (!existingItem) {
        return errorResponse(res, 404, `Item with product ID ${parsedProductId} is not in the cart.`);
      }

      await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: parsedProductId,
          },
        },
        data: { quantity: parsedQuantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/items/:productId
export const removeCartItem = async (req, res, next) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.query.cartId;
    const parsedProductId = parseInt(req.params.productId, 10);

    if (isNaN(parsedProductId) || parsedProductId < 1) {
      return errorResponse(res, 400, 'Invalid productId. Must be a positive integer.');
    }
    if (!cartId) {
      return errorResponse(res, 400, 'x-cart-id header or cartId query param is required.');
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found.');
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: parsedProductId,
      },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.status(200).json(formatCartResponse(updatedCart));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart
export const clearCart = async (req, res, next) => {
  try {
    const cartId = req.headers['x-cart-id'] || req.query.cartId;
    if (!cartId) {
      return errorResponse(res, 400, 'x-cart-id header or cartId query param is required.');
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    const emptyCart = cart || await getOrCreateCart(cartId);

    const reFetched = await prisma.cart.findUnique({
      where: { id: emptyCart.id },
      include: {
        items: {
          include: { product: { include: { category: true } } },
        },
      },
    });

    res.status(200).json(formatCartResponse(reFetched));
  } catch (error) {
    next(error);
  }
};
