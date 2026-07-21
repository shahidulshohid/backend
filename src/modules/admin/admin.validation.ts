import { z } from 'zod';

// ইউজার স্টেটাস আপডেট স্কিমা
export const updateUserStatusValidation = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'BLOCKED', 'DELETED']),
  }),
});

// সাইকোলজিস্ট রিজেকশন স্কিমা
export const rejectPsychologistValidation = z.object({
  body: z.object({
    rejectionReason: z.string({ message: 'বাতিল করার কারণ আবশ্যক' }),
  }),
});
