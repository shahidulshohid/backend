import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { ShippingAddressService } from './shipping-address.service';

// shipping-address.controller.ts ফাইলটি শিপিং অ্যাড্রেসের এক্সপ্রেস রেসপন্স পরিচালনা করে।

// ১. শিপিং ঠিকানা তালিকা দেখা
const getMyShippingAddresses = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await ShippingAddressService.getMyShippingAddresses(userId);
  res.status(200).json(new ApiResponse(200, result, 'শিপিং ঠিকানা তালিকা আনা হয়েছে'));
});

// ২. নতুন শিপিং ঠিকানা তৈরি করা
const createShippingAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await ShippingAddressService.createShippingAddress(userId, req.body);
  res.status(201).json(new ApiResponse(201, result, 'নতুন শিপিং ঠিকানা সেভ করা হয়েছে'));
});

// ৩. শিপিং ঠিকানা আপডেট করা
const updateShippingAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const result = await ShippingAddressService.updateShippingAddress(userId, id, req.body);
  res.status(200).json(new ApiResponse(200, result, 'শিপিং ঠিকানা আপডেট করা হয়েছে'));
});

// ৪. শিপিং ঠিকানা ডিলিট করা
const deleteShippingAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const result = await ShippingAddressService.deleteShippingAddress(userId, id);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const ShippingAddressController = {
  getMyShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
