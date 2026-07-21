import { Router, Request, Response, NextFunction } from 'express';
import { ContentController } from './content.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import {
  getPrivacyPolicyValidation,
  getTermsAndConditionValidation,
  upsertPrivacyPolicyValidation,
  upsertTermsAndConditionsValidation,
} from './content.validation';
import { Role } from '@prisma/client';

// content.routes.ts ফাইলটি অ্যাপের কন্টেন্ট (শর্তাবলী ও প্রাইভেসি পলিসি) এর এন্ডপয়েন্ট পরিচালনা করে।

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

// ১. Terms & Conditions আপডেট (Admin/Super Admin)
router.post(
  '/terms-and-condition',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(upsertTermsAndConditionsValidation),
  ContentController.upsertTermsAndConditions
);

// ২. Terms & Conditions পড়া (Public)
router.get(
  '/terms-and-condition',
  validateRequest(getTermsAndConditionValidation),
  ContentController.getTermsAndCondition
);

// ৩. Privacy Policy আপডেট (Admin/Super Admin)
router.post(
  '/privacy-policy',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(upsertPrivacyPolicyValidation),
  ContentController.upsertPrivacyPolicy
);

// ৪. Privacy Policy পড়া (Public)
router.get(
  '/privacy-policy',
  validateRequest(getPrivacyPolicyValidation),
  ContentController.getPrivacyPolicy
);

export default router;
