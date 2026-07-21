import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { ProductService } from './product.service';

// product.controller.ts ফাইলটি ই-কমার্স প্রডাক্টের এক্সপ্রেস রেসপন্স প্রদান করে।

// ১. প্রডাক্ট যোগ করা (Admin)
const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await ProductService.createProduct(adminId, req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'প্রডাক্ট সফলভাবে যোগ করা হয়েছে'));
});

// ২. সব প্রডাক্ট পড়া (Public)
const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'প্রডাক্ট তালিকা পাওয়া গেছে'));
});

// ৩. একটি নির্দিষ্ট প্রডাক্ট পড়া
const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ProductService.getSingleProduct(id);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'প্রডাক্ট বিবরণ পাওয়া গেছে'));
});

// ৪. প্রডাক্ট আপডেট করা (Admin)
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ProductService.updateProduct(id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'প্রডাক্ট সফলভাবে আপডেট করা হয়েছে'));
});

// ৫. প্রডাক্ট ডিলিট করা (Super Admin)
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ProductService.deleteProduct(id);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
