import { z } from 'zod';

// সেশন রিভিউ জমা দেওয়ার ভ্যালিডেশন
export const createSessionReviewValidation = z.object({
  body: z.object({
    sessionId: z.number().optional(),
    psychicId: z.number({ message: 'সাইকোলজিস্ট আইডি আবশ্যক' }),
    rating: z.number().min(1).max(5, 'রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে'),
    comment: z.string().optional(),
  }),
});
