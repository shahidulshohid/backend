import { Router, Request, Response, NextFunction } from 'express';
import { WalletController } from './wallet.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { createManualTransactionValidation } from './wallet.validation';
import { Role } from '@prisma/client';

// wallet.routes.ts ফাইলটি ওয়ালেট ও ট্রানজ্যাকশন সংক্রান্ত সমস্ত অ্যান্ডপয়েন্ট পরিচালনা করে।

const router = Router();

const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: 'অনুমতি নেই (Forbidden).',
      });
      return;
    }
    next();
  };
};

// ১. আমার নিজস্ব ওয়ালেট ব্যালেন্স পাওয়া
router.get('/my-wallet', protect, WalletController.getMyWallet);

// ২. আমার ওয়ালেটের ট্রানজ্যাকশন হিস্ট্রি দেখা
router.get('/transactions', protect, WalletController.getMyTransactions);

// ৩. অ্যাডমিন দিয়ে ওয়ালেট লেনদেন সম্পাদন (Admin / Super Admin)
router.post(
  '/admin/manual-transaction',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createManualTransactionValidation),
  WalletController.createManualTransaction
);

export default router;
