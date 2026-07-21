import { Router, Request, Response, NextFunction } from 'express';
import { PaymentController } from './payment.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import {
  createPaymentMethodValidation,
  createTopUpValidation,
  requestPayoutValidation,
} from './payment.validation';
import { Role } from '@prisma/client';

// payment.routes.ts ফাইলটি পেমেন্ট, টপআপ এবং পেআউট রিকুয়েস্ট রাউট পরিচালনা করে।

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

// ১. ওয়ালেট টপআপ প্রসেস শুরু করা
router.post(
  '/topup/create-intent',
  protect,
  validateRequest(createTopUpValidation),
  PaymentController.createTopUp
);

// ২. টপআপ কনফার্ম করা
router.post('/topup/confirm/:topUpId', protect, PaymentController.confirmTopUp);

// ৩. উইথড্র / পেআউট রিকুয়েস্ট পাঠানো (Psychologist / Admin / Super Admin)
router.post(
  '/payout/request',
  protect,
  restrictTo(Role.PSYCHOLOGIST, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(requestPayoutValidation),
  PaymentController.requestPayout
);

// ৪. আমার উইথড্র বা পেআউট হিস্ট্রি দেখা
router.get('/payout/my-requests', protect, PaymentController.getMyPayoutRequests);

// ৫. নতুন পেমেন্ট মেথড তৈরি করা
router.post(
  '/methods',
  protect,
  validateRequest(createPaymentMethodValidation),
  PaymentController.createPaymentMethod
);

// ৬. সেভ করা পেমেন্ট মেথড দেখা
router.get('/methods', protect, PaymentController.getMyPaymentMethods);

export default router;
