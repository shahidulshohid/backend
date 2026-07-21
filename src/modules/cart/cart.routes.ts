import { Router } from 'express';
import { CartController } from './cart.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import { addToCartValidation, updateCartItemValidation } from './cart.validation';

// cart.routes.ts ফাইলটি শপিং কার্ট সংক্রান্ত রাউট ডিফাইন করে।

const router = Router();

// ১. আমার শপিং কার্ট ও ব্যালেন্স পড়া
router.get('/', protect, CartController.getMyCart);

// ২. কার্টে আইটেম যোগ করা
router.post(
  '/add',
  protect,
  validateRequest(addToCartValidation),
  CartController.addToCart
);

// ৩. কার্ট আইটেমের সংখ্যা পরিবর্তন করা
router.patch(
  '/item/:itemId',
  protect,
  validateRequest(updateCartItemValidation),
  CartController.updateCartItem
);

// ৪. কার্ট আইটেম ডিলিট করা
router.delete('/item/:itemId', protect, CartController.removeCartItem);

// ৫. কার্ট থেকে সব সরিয়ে ফেলা
router.delete('/clear', protect, CartController.clearCart);

export default router;
