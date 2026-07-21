import { Router } from 'express';
import { ReferralController } from './referral.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { claimReferralValidation } from './referral.validation';

// referral.routes.ts ফাইলটি রেফারাল সিস্টেমের এন্ডপয়েন্ট ম্যানেজ করে।

const router = Router();

// ১. আমার নিজস্ব রেফারাল কোড এবং পরিসংখ্যান
router.get('/my-code', protect, ReferralController.getMyReferralCode);

// ২. অন্যের রেফারাল কোড ক্লেইম করা
router.post(
  '/claim',
  protect,
  validateRequest(claimReferralValidation),
  ReferralController.claimReferralCode
);

export default router;
