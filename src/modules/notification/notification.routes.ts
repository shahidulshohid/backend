import { Router } from 'express';
import { NotificationController } from './notification.controller';
import protect from '../../middlewares/authMiddleware';

// notification.routes.ts ফাইলটি নোটিফিকেশনের জন্য এন্ডপয়েন্ট ডিফাইন করে।

const router = Router();

// ১. আমার সব নোটিফিকেশন পড়া
router.get('/', protect, NotificationController.getMyNotifications);

// ২. সব নোটিফিকেশন এক সাথে Read চিহ্নিত করা
router.patch('/read-all', protect, NotificationController.markAllAsRead);

// ৩. নির্দিষ্ট একটি নোটিফিকেশন Read চিহ্নিত করা
router.patch('/:id/read', protect, NotificationController.markAsRead);

// ৪. নোটিফিকেশন মুছে ফেলা
router.delete('/:id', protect, NotificationController.deleteNotification);

export default router;
