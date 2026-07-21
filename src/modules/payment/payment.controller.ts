import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { PaymentService } from './payment.service';

// payment.controller.ts ফাইলটি পেমেন্ট ও পেআউটের কন্ট্রোলার ফাংশন পরিচালনা করে।

// ১. ওয়ালেট টপআপ ইনটেন্ট শুরু
const createTopUp = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { amount, currency } = req.body;
  const result = await PaymentService.createTopUp(userId, amount, currency);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'টপআপ প্রসেস শুরু হয়েছে'));
});

// ২. টপআপ কনফার্ম করা
const confirmTopUp = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const topUpId = Number(req.params.topUpId);
  const result = await PaymentService.confirmTopUp(userId, topUpId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'টপআপ সফলভাবে সম্পন্ন হয়েছে এবং ওয়ালেটে যুক্ত করা হয়েছে'));
});

// ৩. উইথড্র বা পেআউট রিকুয়েস্ট করা
const requestPayout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { requestedAmount, paymentMethodId } = req.body;
  const result = await PaymentService.requestPayout(userId, requestedAmount, paymentMethodId);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'পেআউট রিকুয়েস্ট পাঠানো হয়েছে'));
});

// ৪. আমার পেআউট হিস্ট্রি দেখা
const getMyPayoutRequests = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await PaymentService.getMyPayoutRequests(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'পেআউট হিস্ট্রি আনা হয়েছে'));
});

// ৫. পেমেন্ট মেথড যোগ করা
const createPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await PaymentService.createPaymentMethod(userId, req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'পেমেন্ট মেথড যুক্ত করা হয়েছে'));
});

// ৬. আমার সেভ করা পেমেন্ট মেথড দেখা
const getMyPaymentMethods = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await PaymentService.getMyPaymentMethods(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'পেমেন্ট মেথড তালিকা পাওয়া গেছে'));
});

export const PaymentController = {
  createTopUp,
  confirmTopUp,
  requestPayout,
  getMyPayoutRequests,
  createPaymentMethod,
  getMyPaymentMethods,
};
