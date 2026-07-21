import { z } from 'zod';

// শিপিং অ্যাড্রেস ক্রিয়েট ভ্যালিডেশন
export const createShippingAddressValidation = z.object({
  body: z.object({
    fullName: z.string({ message: 'গ্রহীতার নাম আবশ্যক' }),
    streetAddress: z.string({ message: 'রাস্তা/গ্রামের ঠিকানা আবশ্যক' }),
    country: z.string({ message: 'দেশের নাম আবশ্যক' }),
    city: z.string({ message: 'শহরের নাম আবশ্যক' }),
    zipCode: z.string({ message: 'জিপ কোড আবশ্যক' }),
    phoneNumber: z.string({ message: 'ফোন নম্বর আবশ্যক' }),
    isDefault: z.boolean().optional(),
  }),
});

// শিপিং অ্যাড্রেস আপডেট ভ্যালিডেশন
export const updateShippingAddressValidation = z.object({
  body: z.object({
    fullName: z.string().optional(),
    streetAddress: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});
