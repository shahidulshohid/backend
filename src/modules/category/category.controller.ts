import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { CategoryService } from './category.service';

// category.controller.ts ফাইলটি ক্লায়েন্টের রিকোয়েস্ট গ্রহণ করে এবং সার্ভিস থেকে রেসপন্স পাঠায়।

// ১. নতুন ক্যাটাগরি তৈরি করা
const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে'));
});

// ২. ক্যাটাগরি আপডেট করা
const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await CategoryService.updateCategory(id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে'));
});

// ৩. আইডি দিয়ে ক্যাটাগরি দেখা
const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await CategoryService.getCategoryById(id);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ক্যাটাগরি তথ্য সফলভাবে আনা হয়েছে'));
});

// ৪. সমস্ত ক্যাটাগরি লিস্ট দেখা (Public/Admin)
const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ক্যাটাগরি লিস্ট সফলভাবে আনা হয়েছে'));
});

// ৫. ক্যাটাগরি মুছে ফেলা (Super Admin)
const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await CategoryService.deleteCategory(id);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ক্যাটাগরি সফলভাবে ডিলিট করা হয়েছে'));
});

export const CategoryController = {
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
};
