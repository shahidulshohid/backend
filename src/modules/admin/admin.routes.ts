import { Router, Request, Response, NextFunction } from 'express';
import { AdminController } from './admin.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { rejectPsychologistValidation, updateUserStatusValidation } from './admin.validation';
import { Role } from '@prisma/client';

// admin.routes.ts ফাইলটি অ্যাডমিন ও সুপার অ্যাডমিন প্যানেলের এন্ডপয়েন্ট ম্যানেজ করে।

const router = Router();

const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: 'অনুমতি নেই (Forbidden). এই ফিচারটি শুধুমাত্র অ্যাডমিন ব্যবহার করতে পারবেন।',
      });
      return;
    }
    next();
  };
};

// ১. ড্যাশবোর্ড ওভারভিউ সম্বলিত তথ্য পড়া
router.get(
  '/dashboard/overview',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getDashboardOverview
);

// ২. সাধারণ ইউজারদের তালিকা দেখা
router.get(
  '/users',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllUsers
);

// ৩. সাইকোলজিস্টদের আবেদন তালিকা পড়া
router.get(
  '/psychologists',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getPsychologists
);

// ৪. সাইকোলজিস্ট আবেদন গ্রহণ/অনুমোদন করা
router.post(
  '/psychologists/:psychologistId/approve',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.approvePsychologist
);

// ৫. সাইকোলজিস্ট আবেদন বাতিল করা
router.post(
  '/psychologists/:psychologistId/reject',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(rejectPsychologistValidation),
  AdminController.rejectPsychologist
);

// ৬. ইউজারকে ব্লক বা একটিভ করা
router.post(
  '/users/:userId/status',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateUserStatusValidation),
  AdminController.updateUserStatus
);

export default router;
