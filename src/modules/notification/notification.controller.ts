import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { NotificationService } from './notification.service';

// notification.controller.ts ফাইলটি নোটিফিকেশনের এক্সপ্রেস রেসপন্স সামলায়।

// ১. আমার নোটিফিকেশনগুলো দেখা
const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await NotificationService.getMyNotifications(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'নোটিফিকেশন তালিকা আনা হয়েছে'));
});

// ২. একটি নোটিফিকেশন Read চিহ্নিত করা
const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const result = await NotificationService.markAsRead(id, userId);
  res.status(200).json(new ApiResponse(200, result, 'নোটিফিকেশন পড়া হিসেবে চিহ্নিত করা হয়েছে'));
});

// ৩. সব নোটিফিকেশন Read চিহ্নিত করা
const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await NotificationService.markAllAsRead(userId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

// ৪. নোটিফিকেশন ডিলিট করা
const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const result = await NotificationService.deleteNotification(id, userId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const NotificationController = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
