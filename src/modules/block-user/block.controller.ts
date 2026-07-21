import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { BlockService } from './block.service';

// block.controller.ts ফাইলটি ব্লক-ইউজার হ্যান্ডলিং এর এক্সপ্রেস কন্ট্রোলার।

// ১. ইউজার ব্লক করা
const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const blockerId = req.user!.id;
  const { blockedId, reason } = req.body;
  const result = await BlockService.blockUser(blockerId, Number(blockedId), reason);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'ইউজারকে ব্লক করা হয়েছে'));
});

// ২. ইউজার আনব্লক করা
const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  const blockerId = req.user!.id;
  const { blockedId } = req.body;
  const result = await BlockService.unblockUser(blockerId, Number(blockedId));
  res.status(200).json(new ApiResponse(200, result, result.message));
});

// ৩. আমার ব্লক করা তালিকা দেখা
const getMyBlockedUsers = asyncHandler(async (req: Request, res: Response) => {
  const blockerId = req.user!.id;
  const result = await BlockService.getMyBlockedUsers(blockerId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ব্লক করা ইউজার লিস্ট আনা হয়েছে'));
});

export const BlockController = {
  blockUser,
  unblockUser,
  getMyBlockedUsers,
};
