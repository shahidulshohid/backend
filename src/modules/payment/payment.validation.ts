import { z } from 'zod';

// টপ-আপ তৈরি ভ্যালিডেশন
export const createTopUpValidation = z.object({
  body: z.object({
    amount: z.number().min(5, 'মিনিমাম ৫ ইউরো/ডলার টপ-আপ করতে হবে'),
    currency: z.string().optional(),
  }),
});

// পেআউট রিকুয়েস্ট তৈরি ভ্যালিডেশন
export const requestPayoutValidation = z.object({
  body: z.object({
    requestedAmount: z.number().min(10, 'মিনিমাম ১০ ইউরো পেআউট রিকুয়েস্ট করা যাবে'),
    paymentMethodId: z.number().optional(),
  }),
});

// পেমেন্ট মেথড তৈরি ভ্যালিডেশন
export const createPaymentMethodValidation = z.object({
  body: z.object({
    type: z.enum(['STRIPE_CARD', 'BANK_ACCOUNT']),
    stripePaymentMethodId: z.string().optional(),
    cardLast4: z.string().optional(),
    cardBrand: z.string().optional(),
    bankName: z.string().optional(),
    accountLast4: z.string().optional(),
    accountHolderName: z.string().optional(),
  }),
});
