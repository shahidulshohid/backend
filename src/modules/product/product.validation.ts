import { z } from 'zod';

// প্রডাক্ট তৈরি ভ্যালিডেশন
export const createProductValidation = z.object({
  body: z.object({
    name: z.string({ message: 'প্রডাক্টের নাম আবশ্যক' }),
    description: z.string({ message: 'প্রডাক্টের বিবরণ আবশ্যক' }),
    regularPrice: z.number().min(0, 'দাম ০ বা তার বেশি হতে হবে'),
    discountPercentage: z.number().min(0).max(100).optional(),
    weight: z.number().optional(),
    categoryId: z.number({ message: 'ক্যাটাগরি আইডি আবশ্যক' }),
    isFeatured: z.boolean().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
  }),
});

// প্রডাক্ট আপডেট ভ্যালিডেশন
export const updateProductValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    regularPrice: z.number().optional(),
    discountPercentage: z.number().optional(),
    weight: z.number().optional(),
    categoryId: z.number().optional(),
    isFeatured: z.boolean().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
  }),
});
