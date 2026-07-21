import { Router } from 'express';
import { CallController } from './call.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { endCallValidation, initiateCallValidation } from './call.validation';

// call.routes.ts ফাইলটি রিয়েলটাইম কল সংক্রান্ত এন্ডপয়েন্টগুলো পরিচালনা করে।

const router = Router();

// ১. নতুন কল শুরু করা
router.post(
  '/initiate',
  protect,
  validateRequest(initiateCallValidation),
  CallController.initiateCall
);

// ২. কল গ্রহণ / একসেপ্ট করা
router.patch('/accept/:callId', protect, CallController.acceptCall);

// ৩. কল শেষ করা এবং ওয়ালেট হিসাব করা
router.patch(
  '/end/:callId',
  protect,
  validateRequest(endCallValidation),
  CallController.endCall
);

// ৪. ইউজারের নিজস্ব কল ইতিহাস দেখা
router.get('/history', protect, CallController.getCallHistory);

export default router;
