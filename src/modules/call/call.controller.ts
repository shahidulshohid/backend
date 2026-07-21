import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { CallService } from './call.service';

// call.controller.ts ফাইলটি কল সেশনের এক্সপ্রেস কন্ট্রোলার প্রসেস করে।

// ১. কল শুরু করা
const initiateCall = asyncHandler(async (req: Request, res: Response) => {
  const callerId = req.user!.id;
  const { receiverId } = req.body;
  const result = await CallService.initiateCall(callerId, Number(receiverId));
  res.status(201).json(new ApiResponse(201, result, 'কল শুরু করা হয়েছে'));
});

// ২. কল রিসিভ করা
const acceptCall = asyncHandler(async (req: Request, res: Response) => {
  const receiverId = req.user!.id;
  const callId = Number(req.params.callId);
  const result = await CallService.acceptCall(callId, receiverId);
  res.status(200).json(new ApiResponse(200, result, 'কল রিসিভ করা হয়েছে'));
});

// ৩. কল শেষ করা
const endCall = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const callId = Number(req.params.callId);
  const { duration } = req.body;
  const result = await CallService.endCall(callId, userId, Number(duration));
  res.status(200).json(new ApiResponse(200, result, 'কল শেষ করা হয়েছে এবং চার্জ হিসেব করা হয়েছে'));
});

// ৪. কল হিস্ট্রি দেখা
const getCallHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await CallService.getCallHistory(userId);
  res.status(200).json(new ApiResponse(200, result, 'কল রেকর্ড পাওয়া গেছে'));
});

export const CallController = {
  initiateCall,
  acceptCall,
  endCall,
  getCallHistory,
};
