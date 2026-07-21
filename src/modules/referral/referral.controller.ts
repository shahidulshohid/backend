import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { ReferralService } from './referral.service';

// referral.controller.ts ফাইলটি রেফারাল মডিউলের কন্ট্রোলার রেসপন্স দেয়।

// ১. আমার রেফারাল কোড দেখা
const getMyReferralCode = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await ReferralService.getMyReferralCode(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'রেফারাল তথ্য পাওয়া গেছে'));
});

// ২. অন্যের রেফারাল কোড ক্লেইম করা
const claimReferralCode = asyncHandler(async (req: Request, res: Response) => {
  const refereeId = req.user!.id;
  const { referralCode } = req.body;
  const result = await ReferralService.claimReferralCode(refereeId, referralCode);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'রেফারাল কোড সফলভাবে ক্লেইম করা হয়েছে'));
});

export const ReferralController = {
  getMyReferralCode,
  claimReferralCode,
};
