import { z } from 'zod';

// স্টোরি তৈরি করার ভ্যালিডেশন স্কিমা
export const createStoryValidation = z.object({
  body: z.object({
    images: z.array(z.string()).min(1, 'কমপক্ষে একটি ছবি থাকতে হবে'),
    privacy: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  }),
});

// স্টোরি ফিড দেখার ভ্যালিডেশন স্কিমা
export const getStoryFeedValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    privacy: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  }),
});
