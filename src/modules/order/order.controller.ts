import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { OrderService } from './order.service';

// order.controller.ts ফাইলটি ই-কমার্স অর্ডারের এক্সপ্রেস রেসপন্স সামলায়।

// ১. নতুন অর্ডার তৈরি করা
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await OrderService.createOrder(userId, req.body);
  res.status(201).json(new ApiResponse(201, result, 'অর্ডার সফলভাবে প্লেস করা হয়েছে'));
});

// ২. আমার অর্ডারসমূহ দেখা
const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await OrderService.getMyOrders(userId);
  res.status(200).json(new ApiResponse(200, result, 'অর্ডার তালিকা পাওয়া গেছে'));
});

// ৩. নির্দিষ্ট অর্ডার ট্রেকিং দেখা
const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const result = await OrderService.getOrderById(id, userId);
  res.status(200).json(new ApiResponse(200, result, 'অর্ডার ট্র্যাকিং তথ্য আনা হয়েছে'));
});

// ৪. অর্ডার স্ট্যাটাস আপডেট করা (Admin)
const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;
  const result = await OrderService.updateOrderStatus(orderId, status);
  res.status(200).json(new ApiResponse(200, result, 'অর্ডার স্ট্যাটাস আপডেট করা হয়েছে'));
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
