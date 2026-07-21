import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from './order.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { createOrderValidation, updateOrderStatusValidation } from './order.validation';
import { Role } from '@prisma/client';

// order.routes.ts ফাইলটি ই-কমার্স অর্ডার সম্পর্কিত অ্যান্ডপয়েন্টগুলো সংজ্ঞায়িত করে।

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

// ১. কার্ট থেকে অর্ডার প্লেস করা
router.post(
  '/create',
  protect,
  validateRequest(createOrderValidation),
  OrderController.createOrder
);

// ২. ইউজারের নিজস্ব অর্ডার তালিকা পাওয়া
router.get('/my-orders', protect, OrderController.getMyOrders);

// ৩. একটি নির্দিষ্ট অর্ডারের ট্র্যাক ও বিবরণ পড়া
router.get('/:id', protect, OrderController.getOrderById);

// ৪. অর্ডার ডেলিভারি স্ট্যাটাস আপডেট করা (Admin / Super Admin)
router.patch(
  '/:id/status',
  protect,
  restrictTo(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateOrderStatusValidation),
  OrderController.updateOrderStatus
);

export default router;
