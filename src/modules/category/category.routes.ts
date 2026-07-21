import { Router, Request, Response, NextFunction } from 'express';
import { CategoryController } from './category.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import {
  createCategoryValidation,
  getCategoriesValidation,
  updateCategoryValidation,
} from './category.validation';
import { Role } from '@prisma/client';

// category.routes.ts ফাইলটি ক্যাটাগরি সম্পর্কিত এন্ডপয়েন্টগুলো পরিচালনা করে।

const router = Router();

// রোল ভিত্তিক অ্যাক্সেস কন্ট্রোল মিডলওয়্যার হেল্পার
const restrictTo = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: 'অনুমতি নেই (Forbidden). এই অ্যাকশনটি করার ক্ষমতা আপনার নেই।',
      });
      return;
    }
    next();
  };
};

// ===============================================
// পাবলিক রাউটসমূহ (কোন লগইন প্রয়োজন নেই)
// ===============================================

// ১. পাবলিকলি সব ক্যাটাগরি দেখা
router.get(
  '/public',
  validateRequest(getCategoriesValidation),
  CategoryController.getAllCategories
);

// ২. পাবলিকলি নির্দিষ্ট ক্যাটাগরি দেখা
router.get('/public/:id', CategoryController.getCategoryById);

// ===============================================
// অ্যাডমিন ও সুপার অ্যাডমিন রাউটসমূহ (লগইন প্রয়োজন)
// ===============================================

// ৩. নতুন ক্যাটাগরি তৈরি করা (অ্যাডমিন / সুপার অ্যাডমিন)
router.post(
  '/',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createCategoryValidation),
  CategoryController.createCategory
);

// ৪. সকল ক্যাটাগরি দেখা (অ্যাডমিন ভিউ)
router.get(
  '/',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(getCategoriesValidation),
  CategoryController.getAllCategories
);

// ৫. নির্দিষ্ট আইডি অনুযায়ী ক্যাটাগরি দেখা
router.get(
  '/:id',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  CategoryController.getCategoryById
);

// ৬. ক্যাটাগরি তথ্য আপডেট করা (অ্যাডমিন / সুপার অ্যাডমিন)
router.patch(
  '/:id',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateCategoryValidation),
  CategoryController.updateCategory
);

// ৭. ক্যাটাগরি ডিলিট করা (শুধুমাত্র সুপার অ্যাডমিন)
router.delete(
  '/:id',
  protect,
  restrictTo(Role.SUPER_ADMIN),
  CategoryController.deleteCategory
);

export default router;
