import { Router } from 'express';
import { SessionReviewController } from './session-review.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { createSessionReviewValidation } from './session-review.validation';

// session-review.routes.ts ফাইলটি সেশন ফিডব্যাকের এন্ডপয়েন্ট ডিফাইন করে।

const router = Router();

// ১. সাইকোলজিস্টকে রিভিউ দেওয়া
router.post(
  '/',
  protect,
  validateRequest(createSessionReviewValidation),
  SessionReviewController.createSessionReview
);

// ২. নির্দিষ্ট সাইকোলজিস্টের রিভিউসমূহ দেখা (পাবলিক)
router.get('/psychic/:psychicId', SessionReviewController.getPsychicReviews);

export default router;
