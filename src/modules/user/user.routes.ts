import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from './user.controller';
import protect from '../../middlewares/authMiddleware';
import { Role } from '@prisma/client';

// user.routes.ts ফাইলটি শুধুমাত্র ইউজার সম্পর্কিত বিভিন্ন রাউটসমূহ ডিফাইন করে
// এবং নির্দিষ্ট মিডলওয়্যার বা কন্ট্রোলারে রিকোয়েস্ট পাঠায়।

const router = Router();

// রোল চেক করার জন্য একটি কাস্টম মিডলওয়্যার হেল্পার
const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
      return;
    }
    next();
  };
};

// ১. ইউজারের নিজস্ব প্রোফাইল দেখা
router.get('/profile', protect, UserController.getProfile);

// ২. ইউজারের নিজস্ব প্রোফাইল আপডেট করা
router.patch('/profile', protect, UserController.updateProfile);

// ৩. প্রোফাইল কমপ্লিট চিহ্নিত করা
router.patch('/profile/complete', protect, UserController.markProfileUpdated);

// ৪. প্রোফাইল পিকচার আপডেট করা
router.post('/profile/image', protect, UserController.uploadProfileImage);

// ৫. প্রোফাইল পিকচার ডিলিট করা
router.delete('/profile/image', protect, UserController.deleteProfileImage);

// ৬. অ্যাডমিন ও সুপার অ্যাডমিনের জন্য সকল ইউজার দেখা
router.get(
  '/',
  protect,
  restrictTo('ADMIN' as any, 'SUPER_ADMIN' as any),
  UserController.getAllUsers,
);

// ৭. পাবলিকলি সকল সাইকোলজিস্টদের দেখা
router.get('/psychics/public', UserController.getAllPsychicsPublic);

// ৮. নির্দিষ্ট সাইকোলজিস্টের প্রোফাইল দেখা
router.get('/psychic/:id', UserController.getPsychicProfile);

// ৯. নির্দিষ্ট সাইকোলজিস্টের স্ট্যাটিস্টিকস দেখা
router.get('/psychic/:id/stats', UserController.getPsychicStats);

// ১০. সাইকোলজিস্টের অনলাইন স্ট্যাটাস আপডেট করা (শুধুমাত্র PSYCHOLOGIST এর জন্য)
router.patch(
  '/online-status',
  protect,
  restrictTo('PSYCHOLOGIST' as any),
  UserController.updateOnlineStatus,
);

// ১১. সাইকোলজিস্টের কল সেটিংস আপডেট করা (শুধুমাত্র PSYCHOLOGIST এর জন্য)
router.patch(
  '/call-settings',
  protect,
  restrictTo('PSYCHOLOGIST' as any),
  UserController.updateCallSetting,
);

// ১২. ইউজার ডিলিট করা (শুধুমাত্র SUPER_ADMIN এর জন্য)
router.delete(
  '/:id',
  protect,
  restrictTo('SUPER_ADMIN' as any),
  UserController.deleteUser,
);

export default router;
