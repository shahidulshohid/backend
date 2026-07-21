import { Router } from 'express';
import { ShippingAddressController } from './shipping-address.controller';
import protect from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import {
  createShippingAddressValidation,
  updateShippingAddressValidation,
} from './shipping-address.validation';

// shipping-address.routes.ts ফাইলটি শিপিং ঠিকানা ক্রিয়েট ও ম্যানেজমেন্ট রাউট প্রদান করে।

const router = Router();

// ১. আমার সমস্ত শিপিং অ্যাড্রেস দেখা
router.get('/', protect, ShippingAddressController.getMyShippingAddresses);

// ২. নতুন শিপিং অ্যাড্রেস যোগ করা
router.post(
  '/',
  protect,
  validateRequest(createShippingAddressValidation),
  ShippingAddressController.createShippingAddress
);

// ৩. শিপিং অ্যাড্রেস আপডেট করা
router.patch(
  '/:id',
  protect,
  validateRequest(updateShippingAddressValidation),
  ShippingAddressController.updateShippingAddress
);

// ৪. শিপিং অ্যাড্রেস ডিলিট করা
router.delete('/:id', protect, ShippingAddressController.deleteShippingAddress);

export default router;
