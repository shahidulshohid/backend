import { Router } from 'express';
import { BlockController } from './block.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { blockUserValidation, unblockUserValidation } from './block.validation';

// block.routes.ts ফাইলটি ইউজার ব্লক ও আনব্লক সংক্রান্ত রাউটস ডিফাইন করে।

const router = Router();

// ১. ইউজার ব্লক করা
router.post(
  '/block',
  protect,
  validateRequest(blockUserValidation),
  BlockController.blockUser
);

// ২. ইউজার আনব্লক করা
router.post(
  '/unblock',
  protect,
  validateRequest(unblockUserValidation),
  BlockController.unblockUser
);

// ৩. আমার ব্লক করা সমস্ত ইউজারের লিস্ট পাওয়া
router.get('/my-blocked', protect, BlockController.getMyBlockedUsers);

export default router;
