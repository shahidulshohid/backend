import { Router, Request, Response, NextFunction } from 'express';
import { SettingsController } from './settings.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { updateSessionSettingsValidation } from './settings.validation';
import { Role } from '@prisma/client';

// settings.routes.ts ফাইলটি সেটিংস সম্পর্কিত অ্যান্ডপয়েন্টগুলো ম্যানেজ করে।

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

// ১. সেশন সেটিংস দেখা (logged in users)
router.get(
  '/session-settings',
  protect,
  SettingsController.getSessionSettings
);

// ২. সেশন সেটিংস আপডেট (Admin / Super Admin)
router.patch(
  '/session-settings',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateSessionSettingsValidation),
  SettingsController.updateSessionSettings
);

// ৩. পেআউট রিলিজ দিন পড়া
router.get(
  '/payout-release-day',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN, Role.PSYCHOLOGIST),
  SettingsController.getPayoutReleaseDay
);

export default router;
