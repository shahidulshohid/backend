import { z } from 'zod';

// কার্টে আইটেম যোগ করার ভ্যালিডেশন
export const addToCartValidation = z.object({
  body: z.object({
    productId: z.number({ message: 'প্রডাক্ট আইডি আবশ্যক' }),
    selectedSize: z.string().optional(),
    quantity: z.number().min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে').optional(),
  }),
});

// কার্ট আইটেম আপডেট করার ভ্যালিডেশন
export const updateCartItemValidation = z.object({
  body: z.object({
    quantity: z.number().min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে'),
  }),
});
