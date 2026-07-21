import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { SessionReviewService } from './session-review.service';

// session-review.controller.ts ফাইলটি সেশন রিভিউ এক্সপ্রেস কন্ট্রোলার প্রসেস করে।

// ১. সাইকোলজিস্টকে রিভিউ দেওয়া
const createSessionReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await SessionReviewService.createSessionReview(userId, req.body);
  res.status(201).json(new ApiResponse(201, result, 'রিভিউ সফলভাবে পোস্ট করা হয়েছে'));
});

// ২. সাইকোলজিস্টের রিভিউসমূহ দেখা
const getPsychicReviews = asyncHandler(async (req: Request, res: Response) => {
  const psychicId = Number(req.params.psychicId);
  const result = await SessionReviewService.getPsychicReviews(psychicId);
  res.status(200).json(new ApiResponse(200, result, 'রিভিউ তালিকা আনা হয়েছে'));
});

export const SessionReviewController = {
  createSessionReview,
  getPsychicReviews,
};
