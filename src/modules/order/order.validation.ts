import { z } from 'zod';

// অর্ডার প্লেস ভ্যালিডেশন
export const createOrderValidation = z.object({
  body: z.object({
    shippingAddressId: z.number({ message: 'শিপিং অ্যাড্রেস আইডি আবশ্যক' }),
    paymentMethod: z.string().optional(),
  }),
});

// অর্ডার স্ট্যাটাস আপডেট ভ্যালিডেশন (Admin)
export const updateOrderStatusValidation = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED']),
  }),
});
