import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { SettingsService } from './settings.service';

// settings.controller.ts ফাইলটি সেটিংস সংক্রান্ত রিকোয়েস্ট গ্রহণ ও রেসপন্স পাঠায়।

// ১. সেশন সেটিংস দেখা
const getSessionSettings = asyncHandler(async (req: Request, res: Response) => {
  const result = await SettingsService.getSessionSettings();
  res
    .status(200)
    .json(new ApiResponse(200, result, 'সেশন সেটিংস সফলভাবে আনা হয়েছে'));
});

// ২. সেশন সেটিংস আপডেট (Admin)
const updateSessionSettings = asyncHandler(async (req: Request, res: Response) => {
  const result = await SettingsService.updateSessionSettings(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'সেশন সেটিংস সফলভাবে আপডেট করা হয়েছে'));
});

// ৩. পেআউট রিলিজের দিন দেখা
const getPayoutReleaseDay = asyncHandler(async (req: Request, res: Response) => {
  const result = await SettingsService.getPayoutReleaseDay();
  res
    .status(200)
    .json(new ApiResponse(200, result, 'পেআউট রিলিজ দিন তথ্য পাওয়া গেছে'));
});

export const SettingsController = {
  getSessionSettings,
  updateSessionSettings,
  getPayoutReleaseDay,
};
