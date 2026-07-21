import { z } from 'zod';

// ক্যাটাগরি তৈরি করার ভ্যালিডেশন স্কিমা
export const createCategoryValidation = z.object({
  body: z.object({
    name: z.string({
      message: 'ক্যাটাগরির নাম আবশ্যক',
    }).min(1, 'ক্যাটাগরির নাম খালি রাখা যাবে না'),
    type: z.enum(['SERVICE', 'PRODUCT'], {
      message: 'ক্যাটাগরির টাইপ (SERVICE বা PRODUCT) নির্বাচন করুন',
    }),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

// ক্যাটাগরি আপডেট করার ভ্যালিডেশন স্কিমা
export const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['SERVICE', 'PRODUCT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

// ক্যাটাগরি লিস্ট ফিল্টারিং ভ্যালিডেশন স্কিমা
export const getCategoriesValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    searchTerm: z.string().optional(),
    type: z.enum(['SERVICE', 'PRODUCT']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});
