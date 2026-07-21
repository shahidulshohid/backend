import { PrismaClient, OrderStatus, OrderPaymentStatus } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// order.service.ts ফাইলটি শপিং কার্ট থেকে প্রডাক্ট অর্ডার সম্পন্ন করা ও অর্ডার হিস্ট্রি পরিচালন করে।

const prisma = new PrismaClient();

// ১. কার্ট থেকে অর্ডার প্লেস করা
const createOrder = async (userId: number, payload: {
  shippingAddressId: number;
  paymentMethod?: string;
}) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'আপনার কার্টে কোনো প্রডাক্ট নেই');
  }

  const address = await prisma.shippingAddress.findUnique({
    where: { id: payload.shippingAddressId },
  });

  if (!address || address.userId !== userId) {
    throw new ApiError(404, 'শিপিং ঠিকানা পাওয়া যায়নি');
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
  const deliveryCharge = 5; // 5 EUR delivery charge
  const grandTotal = subtotal + deliveryCharge;

  // ইউনিক অর্ডার আইডি ও ট্র্যাকিং আইডি জেনারেট করা
  const orderId = `ORD-${Date.now()}`;
  const trackingId = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

  const order = await prisma.$transaction(async (tx) => {
    // ১. অর্ডার অবজেক্ট তৈরি
    const createdOrder = await tx.order.create({
      data: {
        orderId,
        trackingId,
        userId,
        shippingAddressId: address.id,
        shippingSnapshot: address as any,
        subtotal,
        deliveryCharge,
        grandTotal,
        status: OrderStatus.PENDING,
        paymentStatus: OrderPaymentStatus.PENDING,
        paymentMethod: payload.paymentMethod || 'card',
      },
    });

    // ২. প্রতিটি প্রডাক্টের জন্য অর্ডার আইটেম তৈরি
    for (const item of cart.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      await tx.orderItem.create({
        data: {
          orderId: createdOrder.id,
          productId: item.productId,
          productName: product?.name || 'Product',
          selectedSize: item.selectedSize,
          quantity: item.quantity,
          unitPrice: item.priceSnapshot,
          totalPrice: item.priceSnapshot * item.quantity,
        },
      });
    }

    // ৩. অর্ডার করার পর কার্ট সম্পূর্ণ ক্লিয়ার করা
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return order;
};

// ২. আমার অর্ডার হিস্ট্রি পড়া
const getMyOrders = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true, shippingAddress: true },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

// ৩. একটি নির্দিষ্ট অর্ডার ট্র্যাকিং/বিবরণ পড়া
const getOrderById = async (id: number, userId: number) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  });

  if (!order || order.userId !== userId) {
    throw new ApiError(404, 'অর্ডার পাওয়া যায়নি');
  }

  return order;
};

// ৪. অ্যাডমিন দ্বারা অর্ডার স্ট্যাটাস পরিবর্তন করা (Admin / Super Admin)
const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new ApiError(404, 'অর্ডার পাওয়া যায়নি');
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });

  return updated;
};

export const OrderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
