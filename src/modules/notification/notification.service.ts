import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// notification.service.ts ফাইলটি নোটিফিকেশন পড়া, রিড স্ট্যাটাস এবং ডিলিট অপারেশন পরিচালনা করে।

const prisma = new PrismaClient();

// ১. ইউজারের সমস্ত নোটিফিকেশন আনা
const getMyNotifications = async (receiverId: number) => {
  const notifications = await prisma.notification.findMany({
    where: { receiverId },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: { id: true, name: true, profileImage: true },
      },
    },
  });

  const unreadCount = await prisma.notification.count({
    where: { receiverId, isRead: false },
  });

  return {
    unreadCount,
    data: notifications,
  };
};

// ২. নির্দিষ্ট একটি নোটিফিকেশন পড়া হিসেবে চিহ্নিত করা
const markAsRead = async (notificationId: number, receiverId: number) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.receiverId !== receiverId) {
    throw new ApiError(404, 'নোটিফিকেশন পাওয়া যায়নি');
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return updated;
};

// ৩. সমস্ত নোটিফিকেশন এক সাথে পড়া চিহ্নিত করা
const markAllAsRead = async (receiverId: number) => {
  await prisma.notification.updateMany({
    where: { receiverId, isRead: false },
    data: { isRead: true },
  });

  return { message: 'সব নোটিফিকেশন পড়া হিসেবে চিহ্নিত করা হয়েছে' };
};

// ৪. নোটিফিকেশন মুছে ফেলা
const deleteNotification = async (notificationId: number, receiverId: number) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.receiverId !== receiverId) {
    throw new ApiError(404, 'নোটিফিকেশন পাওয়া যায়নি');
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { message: 'নোটিফিকেশন ডিলিট করা হয়েছে' };
};

export const NotificationService = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
