import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/apiResponse';
import { CartService } from './cart.service';

// cart.controller.ts ফাইলটি শপিং কার্ট সংক্রান্ত কন্ট্রোলার রেসপন্স দেয়।

// ১. আমার শপিং কার্ট দেখা
const getMyCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await CartService.getMyCart(userId);
  res.status(200).json(new ApiResponse(200, result, 'কার্ট আইটেমসমূহ পাওয়া গেছে'));
});

// ২. কার্টে প্রডাক্ট যোগ করা
const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await CartService.addToCart(userId, req.body);
  res.status(201).json(new ApiResponse(201, result, 'কার্টে আইটেম যুক্ত করা হয়েছে'));
});

// ৩. কার্ট আইটেম আপডেট করা
const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const itemId = Number(req.params.itemId);
  const { quantity } = req.body;
  const result = await CartService.updateCartItem(userId, itemId, quantity);
  res.status(200).json(new ApiResponse(200, result, 'কার্ট আইটেম আপডেট করা হয়েছে'));
});

// ৪. কার্ট থেকে আইটেম ডিলিট করা
const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const itemId = Number(req.params.itemId);
  const result = await CartService.removeCartItem(userId, itemId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

// ৫. কার্ট ক্লিয়ার করা
const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await CartService.clearCart(userId);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const CartController = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
