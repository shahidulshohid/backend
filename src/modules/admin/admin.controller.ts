import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { AdminService } from './admin.service';

// admin.controller.ts ফাইলটি অ্যাডমিন প্যানেলের এক্সপ্রেস কন্ট্রোলার রেসপন্স দেয়।

// ১. ড্যাশবোর্ড ওভারভিউ
const getDashboardOverview = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardOverview();
  res.status(200).json(new ApiResponse(200, result, 'ড্যাশবোর্ড পরিসংখ্যান পাওয়া গেছে'));
});

// ২. সব ইউজারের তথ্য দেখা
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'ইউজার তালিকা আনা হয়েছে'));
});

// ৩. সাইকোলজিস্ট আবেদন তালিকা
const getPsychologists = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as any;
  const result = await AdminService.getPsychologists(status);
  res.status(200).json(new ApiResponse(200, result, 'সাইকোলজিস্ট আবেদন তালিকা আনা হয়েছে'));
});

// ৪. সাইকোলজিস্ট আবেদন গ্রহণ করা
const approvePsychologist = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const psychologistId = Number(req.params.psychologistId);
  const result = await AdminService.approvePsychologist(psychologistId, adminId);
  res.status(200).json(new ApiResponse(200, result, 'সাইকোলজিস্ট অ্যাকাউন্ট অনুমোদন করা হয়েছে'));
});

// ৫. সাইকোলজিস্ট আবেদন বাতিল করা
const rejectPsychologist = asyncHandler(async (req: Request, res: Response) => {
  const psychologistId = Number(req.params.psychologistId);
  const { rejectionReason } = req.body;
  const result = await AdminService.rejectPsychologist(psychologistId, rejectionReason);
  res.status(200).json(new ApiResponse(200, result, 'সাইকোলজিস্ট আবেদন বাতিল করা হয়েছে'));
});

// ৬. ইউজারের স্ট্যাটাস পরিবর্তন করা (Active/Blocked/Deleted)
const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { status } = req.body;
  const result = await AdminService.updateUserStatus(userId, status);
  res.status(200).json(new ApiResponse(200, result, 'ইউজার স্ট্যাটাস পরিবর্তন করা হয়েছে'));
});

export const AdminController = {
  getDashboardOverview,
  getAllUsers,
  getPsychologists,
  approvePsychologist,
  rejectPsychologist,
  updateUserStatus,
};
