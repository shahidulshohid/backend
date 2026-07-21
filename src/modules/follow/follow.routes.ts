import { Router } from 'express';
import { FollowController } from './follow.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { followUserValidation } from './follow.validation';

// follow.routes.ts ফাইলটি সামাজিক নেটওয়ার্কিং (ফলো/আনফলো) এর রাউট হ্যান্ডেল করে।

const router = Router();

// ১. ফলো করা
router.post(
  '/follow/:userId',
  protect,
  validateRequest(followUserValidation),
  FollowController.followUser
);

// ২. আনফলো করা
router.post(
  '/unfollow/:userId',
  protect,
  validateRequest(followUserValidation),
  FollowController.unfollowUser
);

// ৩. যেকোনো ইউজারের ফলোয়ারদের দেখা
router.get('/followers/:userId', FollowController.getFollowers);

// ৪. যেকোনো ইউজারের ফলোয়িং তালিকা দেখা
router.get('/following/:userId', FollowController.getFollowing);

export default router;
