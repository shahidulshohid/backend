import { Router } from 'express';
import { StoryController } from './story.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { createStoryValidation } from './story.validation';

// story.routes.ts ফাইলটি ইউজারের স্টোরি শেয়ারিং অ্যান্ডপয়েন্ট ডিফাইন করে।

const router = Router();

// ১. স্টোরি পোস্ট করা
router.post(
  '/',
  protect,
  validateRequest(createStoryValidation),
  StoryController.addStory
);

// ২. নির্দিষ্ট ইউজারের স্টোরি দেখা
router.get('/user/:userId', protect, StoryController.getStoriesByUser);

// ৩. একটি নির্দিষ্ট স্টোরি পড়া
router.get('/:id', protect, StoryController.getSingleStory);

// ৪. স্টোরিতে রিঅ্যাক্ট দেওয়া / উঠানো
router.post('/:id/react', protect, StoryController.toggleReactStory);

// ৫. স্টোরি ডিলিট করা
router.delete('/:id', protect, StoryController.deleteStory);

export default router;
