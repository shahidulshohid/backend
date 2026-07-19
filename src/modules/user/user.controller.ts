import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { UserService } from './user.service';
import {
  updateUserValidationSchema,
  getUsersValidationSchema,
  getPsychicsValidationSchema,
  updateCallSettingValidationSchema,
  updateOnlineStatusValidationSchema,
} from './user.validation';
// user.controller.ts ফাইলটি এক্সপ্রেসের রিকোয়েস্ট গ্রহণ করে ভ্যালিডেশন করে
// এবং UserService-এর মাধ্যমে ডাটা প্রসেস করে ক্লায়েন্টকে রেসপন্স ফেরত দেয়।

// ১. ইউজারের প্রোফাইল নিয়ে আসা
const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // req.user! নিশ্চিত করা হচ্ছে কারণ এটি প্রটেক্টেড রাউট
  const result = await UserService.getProfile(req.user!.id);
  res.status(200).json(new ApiResponse(200, result, 'Profile retrieved successfully'));
});

// ২. ইউজারের প্রোফাইল আপডেট করা
const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  // Zod ভ্যালিডেশন চেক
  const validationResult = updateUserValidationSchema.safeParse({ body: req.body });
  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  const result = await UserService.updateProfile(req.user!.id, req.body);
  res.status(200).json(new ApiResponse(200, result, 'Profile updated successfully'));
});

// ৩. প্রোফাইল পিকচার আপলোড/আপডেট করা
const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  // যেহেতু কোনো এক্সটার্নাল ইমেজ আপলোডার মিডলওয়্যার নেই, বডি থেকে ডিরেক্ট profileImage স্ট্রিং বা ইউআরএল নেওয়া হচ্ছে
  const profileImageUrl = req.body.profileImage;
  if (!profileImageUrl) {
    res.status(400).json({ success: false, message: 'profileImage URL is required in body' });
    return;
  }

  const result = await UserService.uploadProfileImage(req.user!.id, profileImageUrl);
  res.status(200).json(new ApiResponse(200, result, 'Profile image updated successfully'));
});

// ৪. প্রোফাইল পিকচার ডিলিট করা
const deleteProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.deleteProfileImage(req.user!.id);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

// ৫. অ্যাডমিনদের জন্য সকল ইউজার দেখা
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  // Zod কোয়েরি ভ্যালিডেশন
  const validationResult = getUsersValidationSchema.safeParse({ query: req.query });
  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // Zod ভ্যালিডেশন থেকে পার্স করা ও টাইপ-সেফ ডাটা নেওয়া হচ্ছে
  const { page, limit, searchTerm, role } = validationResult.data.query;

  const filters = {
    searchTerm,
    role,
  };

  const options = {
    page,
    limit,
  };

  const result = await UserService.getAllUsers(options, filters);
  res.status(200).json(new ApiResponse(200, result.data, 'Users retrieved successfully'));
});

// ৬. পাবলিক ডিরেক্টরি দিয়ে সকল সাইকোলজিস্ট দেখা
const getAllPsychicsPublic = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = getPsychicsValidationSchema.safeParse({ query: req.query });
  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  // Zod ভ্যালিডেশন থেকে পার্স করা ও টাইপ-সেফ ডাটা নেওয়া হচ্ছে
  const { page, limit, searchTerm, onlineStatus } = validationResult.data.query;

  const filters = {
    searchTerm,
    onlineStatus,
  };

  const options = {
    page,
    limit,
  };

  const result = await UserService.getAllPsychicsPublic(options, filters);
  res.status(200).json(new ApiResponse(200, result.data, 'Psychics retrieved successfully'));
});

// ৭. নির্দিষ্ট সাইকোলজিস্টের প্রোফাইল দেখা
const getPsychicProfile = asyncHandler(async (req: Request, res: Response) => {
  const psychicId = parseInt(req.params.id as string, 10);
  if (isNaN(psychicId)) {
    res.status(400).json({ success: false, message: 'Invalid psychologist ID' });
    return;
  }

  const result = await UserService.getPsychicProfile(psychicId);
  res.status(200).json(new ApiResponse(200, result, 'Psychologist profile retrieved successfully'));
});

// ৮. নির্দিষ্ট সাইকোলজিস্টের স্ট্যাটিস্টিকস দেখা
const getPsychicStats = asyncHandler(async (req: Request, res: Response) => {
  const psychicId = parseInt(req.params.id as string, 10);
  if (isNaN(psychicId)) {
    res.status(400).json({ success: false, message: 'Invalid psychologist ID' });
    return;
  }

  const result = await UserService.getPsychicStats(psychicId);
  res.status(200).json(new ApiResponse(200, result, 'Psychologist stats retrieved successfully'));
});

// ৯. অনলাইন স্ট্যাটাস পরিবর্তন করা
const updateOnlineStatus = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = updateOnlineStatusValidationSchema.safeParse({ body: req.body });
  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  const result = await UserService.updateOnlineStatus(req.user!.id, req.body.onlineStatus as any);
  res.status(200).json(new ApiResponse(200, result, 'Online status updated successfully'));
});

// ১০. কল সেটিংস পরিবর্তন করা
const updateCallSetting = asyncHandler(async (req: Request, res: Response) => {
  const validationResult = updateCallSettingValidationSchema.safeParse({ body: req.body });
  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: validationResult.error.issues,
    });
    return;
  }

  const result = await UserService.updateCallSetting(req.user!.id, req.body);
  res.status(200).json(new ApiResponse(200, result, 'Call settings updated successfully'));
});

// ১১. প্রোফাইল কমপ্লিট চিহ্নিত করা
const markProfileUpdated = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.markProfileUpdated(req.user!.id);
  res.status(200).json(new ApiResponse(200, result, 'Profile marked as updated'));
});

// ১২. ইউজার ডিলিট করা
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const targetId = parseInt(req.params.id as string, 10);
  if (isNaN(targetId)) {
    res.status(400).json({ success: false, message: 'Invalid user ID' });
    return;
  }

  const result = await UserService.deleteUser(targetId);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export const UserController = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  getAllUsers,
  getAllPsychicsPublic,
  getPsychicProfile,
  getPsychicStats,
  updateOnlineStatus,
  updateCallSetting,
  markProfileUpdated,
  deleteUser,
};
