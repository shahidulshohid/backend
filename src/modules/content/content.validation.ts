import { z } from 'zod';

// টার্মস অ্যান্ড কন্ডিশনস আপডেট/তৈরির ভ্যালিডেশন
export const upsertTermsAndConditionsValidation = z.object({
  body: z.object({
    content: z.string({
      message: 'কন্টেন্ট দেওয়া আবশ্যক',
    }),
    type: z.enum(['USER', 'PSYCHOLOGIST', 'ADMIN', 'SUPER_ADMIN'], {
      message: 'ইউজার টাইপ সিলেক্ট করুন',
    }),
  }),
});

// টার্মস দেখার ভ্যালিডেশন
export const getTermsAndConditionValidation = z.object({
  query: z.object({
    type: z.enum(['USER', 'PSYCHOLOGIST', 'ADMIN', 'SUPER_ADMIN']).optional(),
  }),
});

// প্রাইভেসি পলিসি আপডেট/তৈরির ভ্যালিডেশন
export const upsertPrivacyPolicyValidation = z.object({
  body: z.object({
    content: z.string({
      message: 'কন্টেন্ট দেওয়া আবশ্যক',
    }),
    type: z.enum(['USER', 'PSYCHOLOGIST', 'ADMIN', 'SUPER_ADMIN'], {
      message: 'ইউজার টাইপ সিলেক্ট করুন',
    }),
  }),
});

// প্রাইভেসি পলিসি দেখার ভ্যালিডেশন
export const getPrivacyPolicyValidation = z.object({
  query: z.object({
    type: z.enum(['USER', 'PSYCHOLOGIST', 'ADMIN', 'SUPER_ADMIN']).optional(),
  }),
});
