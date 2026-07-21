import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { WalletService } from './wallet.service';

// wallet.controller.ts ফাইলটি ওয়ালেটের এক্সপ্রেস রেসপন্স প্রদান করে।

// ১. আমার ওয়ালেট ব্যালেন্স দেখা
const getMyWallet = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await WalletService.getMyWallet(userId);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'ওয়ালেট ব্যালেন্স ও সামারি আনা হয়েছে'));
});

// ২. আমার সমস্ত লেনদেনের হিস্ট্রি দেখা
const getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await WalletService.getMyTransactions(userId, req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result, 'লেনদেনের ইতিহাস পাওয়া গেছে'));
});

// ৩. অ্যাডমিন দিয়ে ম্যানুয়াল লেনদেন তৈরি করা
const createManualTransaction = asyncHandler(async (req: Request, res: Response) => {
  const result = await WalletService.createManualTransaction(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, 'ম্যানুয়াল লেনদেন সফল হয়েছে'));
});

export const WalletController = {
  getMyWallet,
  getMyTransactions,
  createManualTransaction,
};
