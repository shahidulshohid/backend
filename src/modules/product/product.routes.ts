import { Router, Request, Response, NextFunction } from 'express';
import { ProductController } from './product.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { createProductValidation, updateProductValidation } from './product.validation';
import { Role } from '@prisma/client';

// product.routes.ts ফাইলটি ই-কমার্স প্রডাক্টের অ্যান্ডপয়েন্টগুলো সেটআপ করে।

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

// ১. সব প্রডাক্ট দেখা (পাবলিক)
router.get('/', ProductController.getAllProducts);

// ২. নির্দিষ্ট আইডি অনুযায়ী প্রডাক্ট দেখা (পাবলিক)
router.get('/:id', ProductController.getSingleProduct);

// ৩. নতুন প্রডাক্ট তৈরি (অ্যাডমিন / সুপার অ্যাডমিন)
router.post(
  '/',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createProductValidation),
  ProductController.createProduct
);

// ৪. প্রডাক্ট আপডেট (অ্যাডমিন / সুপার অ্যাডমিন)
router.patch(
  '/:id',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateProductValidation),
  ProductController.updateProduct
);

// ৫. প্রডাক্ট ডিলিট (সুপার অ্যাডমিন)
router.delete(
  '/:id',
  protect,
  restrictTo(Role.SUPER_ADMIN),
  ProductController.deleteProduct
);

export default router;
