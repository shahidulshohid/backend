import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// cart.service.ts ফাইলটি ইউজারের কেনাকাটার শপিং কার্ট পরিচালনা করে।

const prisma = new PrismaClient();

// ১. ইউজারের কার্ট পাওয়া (না থাকলে নতুন অটো-জেনারেট করা)
const getMyCart = async (userId: number) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: true,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  // সব কার্ট আইটেমের মোট প্রাইস হিসাব করা
  const totalAmount = cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);

  return {
    cart,
    totalItems: cart.items.length,
    totalAmount,
  };
};

// ২. কার্টে আইটেম যোগ করা
const addToCart = async (userId: number, payload: {
  productId: number;
  selectedSize?: string;
  quantity?: number;
}) => {
  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!product) {
    throw new ApiError(404, 'প্রডাক্ট পাওয়া যায়নি');
  }

  const cartData = await getMyCart(userId);
  const cartId = cartData.cart.id;
  const qty = payload.quantity || 1;

  // একই প্রডাক্ট ও সাইজের আইটেম কার্টে আগে থেকেই আছে কিনা দেখা
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      productId: payload.productId,
      selectedSize: payload.selectedSize || null,
    },
  });

  if (existingItem) {
    // থাকলে তার কোয়ান্টিটি বৃদ্ধি করা
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + qty },
    });
    return updatedItem;
  }

  // না থাকলে নতুন কার্ট আইটেম তৈরি করা
  const newItem = await prisma.cartItem.create({
    data: {
      cartId,
      productId: payload.productId,
      selectedSize: payload.selectedSize,
      quantity: qty,
      priceSnapshot: product.finalPrice,
    },
  });

  return newItem;
};

// ৩. কার্ট আইটেমের কোয়ান্টিটি আপডেট করা
const updateCartItem = async (userId: number, itemId: number, quantity: number) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new ApiError(404, 'কার্ট আইটেম পাওয়া যায়নি');
  }

  const updated = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return updated;
};

// ৪. কার্ট আইটেম মুছে ফেলা
const removeCartItem = async (userId: number, itemId: number) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new ApiError(404, 'কার্ট আইটেম পাওয়া যায়নি');
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return { message: 'কার্ট আইটেম রিমুভ করা হয়েছে' };
};

// ৫. সম্পূর্ণ কার্ট খালি করা
const clearCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  return { message: 'কার্ট খালি করা হয়েছে' };
};

export const CartService = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
