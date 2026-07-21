import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { FollowService } from './follow.service';

// follow.controller.ts ফাইলটি ফলো সংক্রান্ত কন্ট্রোলার হ্যান্ডলিং নিশ্চিত করে।

// ১. ফলো করা
const followUser = asyncHandler(async (req: Request, res: Response) => {
  const followerId = req.user!.id;
  const followedId = Number(req.params.userId);
  const result = await FollowService.followUser(followerId, followedId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'সফলভাবে ফলো করা হয়েছে'));
});

// ২. আনফলো করা
const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const followerId = req.user!.id;
  const followedId = Number(req.params.userId);
  const result = await FollowService.unfollowUser(followerId, followedId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

// ৩. কারো ফলোয়ার্স দেখা
const getFollowers = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const result = await FollowService.getFollowers(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ফলোয়ার্স লিস্ট পাওয়া গেছে'));
});

// ৪. কারো ফলোয়িং দেখা
const getFollowing = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const result = await FollowService.getFollowing(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ফলোয়িং লিস্ট পাওয়া গেছে'));
});

export const FollowController = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
