import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { ContentService } from './content.service';
import { Role } from '@prisma/client';

// content.controller.ts ফাইলটি কন্টেন্ট (Terms & Privacy Policy) এর কন্ট্রোলার লজিক সম্পন্ন করে।

// ১. Terms and Conditions তৈরি বা আপডেট (Admin)
const upsertTermsAndConditions = asyncHandler(async (req: Request, res: Response) => {
  const result = await ContentService.upsertTermsAndConditions(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'শর্তাবলী সফলভাবে সেভ করা হয়েছে'));
});

// ২. Terms and Conditions দেখা (Public)
const getTermsAndCondition = asyncHandler(async (req: Request, res: Response) => {
  const type = (req.query.type as Role) || Role.USER;
  const result = await ContentService.getTermsAndCondition(type);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'শর্তাবলী সফলভাবে আনা হয়েছে'));
});

// ৩. Privacy Policy তৈরি বা আপডেট (Admin)
const upsertPrivacyPolicy = asyncHandler(async (req: Request, res: Response) => {
  const result = await ContentService.upsertPrivacyPolicy(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'প্রাইভেসি পলিসি সফলভাবে সেভ করা হয়েছে'));
});

// ৪. Privacy Policy দেখা (Public)
const getPrivacyPolicy = asyncHandler(async (req: Request, res: Response) => {
  const type = (req.query.type as Role) || Role.USER;
  const result = await ContentService.getPrivacyPolicy(type);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'প্রাইভেসি পলিসি সফলভাবে আনা হয়েছে'));
});

export const ContentController = {
  upsertTermsAndConditions,
  getTermsAndCondition,
  upsertPrivacyPolicy,
  getPrivacyPolicy,
};
