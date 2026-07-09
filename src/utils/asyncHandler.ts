import { Request, Response, NextFunction } from 'express';

// asyncHandler.ts ফাইলটির কাজ হলো আমাদের কন্ট্রোলার (Controller) ফাংশনগুলোর try-catch ব্লকের কাজ কমানো।
// এই ফাংশনটি আমাদের অ্যাসিঙ্ক্রোনাস (asynchronous) কোডের মধ্যে কোনো এরর আসলে তা স্বয়ংক্রিয়ভাবে গ্লোবাল এরর হ্যান্ডলারে পাঠিয়ে দেয়।

export const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};