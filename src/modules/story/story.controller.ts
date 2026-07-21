import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { StoryService } from './story.service';

// story.controller.ts ফাইলটি স্টোরি সংক্রান্ত সমস্ত রিকোয়েস্ট নিয়ন্ত্রণ করে।

// ১. নতুন স্টোরি যোগ করা
const addStory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await StoryService.addStory(userId, req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'স্টোরি সফলভাবে পোস্ট করা হয়েছে'));
});

// ২. একটি স্টোরি দেখা
const getSingleStory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storyId = Number(req.params.id);
  const result = await StoryService.getSingleStory(storyId, userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'স্টোরি তথ্য সফলভাবে পাওয়া গেছে'));
});

// ৩. নির্দিষ্ট ইউজারের স্টোরি দেখা
const getStoriesByUser = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const targetUserId = Number(req.params.userId);
  const result = await StoryService.getStoriesByUser(targetUserId, currentUserId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'স্টোরি লিস্ট আনা হয়েছে'));
});

// ৪. স্টোরিতে রিঅ্যাক্ট টগল করা
const toggleReactStory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storyId = Number(req.params.id);
  const result = await StoryService.toggleReactStory(storyId, userId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

// ৫. স্টোরি ডিলিট করা
const deleteStory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storyId = Number(req.params.id);
  const result = await StoryService.deleteStory(storyId, userId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const StoryController = {
  addStory,
  getSingleStory,
  getStoriesByUser,
  toggleReactStory,
  deleteStory,
};
