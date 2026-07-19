import { z } from 'zod';

// user.validation.ts ফাইলটি ইউজারের প্রোফাইল আপডেট বা অন্যান্য ইউজার সম্পর্কিত API রিকোয়েস্টগুলোর
// ইনপুট ভ্যালিডেশন নিশ্চিত করার জন্য Zod ব্যবহার করে তৈরি করা হয়েছে।

export const updateUserValidationSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name cannot exceed 100 characters')
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[\d\s\-()]{7,15}$/, 'Invalid phone number format')
      .optional(),
    nid: z
      .string()
      .min(1, 'NID cannot be empty')
      .max(30, 'NID cannot exceed 30 characters')
      .optional(),
    streetAddress: z
      .string()
      .max(255, 'Street address cannot exceed 255 characters')
      .optional(),
    city: z
      .string()
      .min(1, 'City cannot be empty')
      .max(100, 'City cannot exceed 100 characters')
      .optional(),
    zip: z
      .string()
      .regex(/^[A-Za-z0-9\s\-]{1,20}$/, 'Invalid ZIP format')
      .optional(),
    country: z
      .string()
      .min(1, 'Country cannot be empty')
      .max(100, 'Country cannot exceed 100 characters')
      .optional(),
    aboutMe: z.string().min(1, 'About me is required').optional(),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .transform((val) => new Date(val))
      .optional(),
    language: z
      .string()
      .min(1, 'Language cannot be empty')
      .max(50, 'Language cannot exceed 50 characters')
      .optional(),
    hobby: z
      .array(z.string().min(1, 'Hobby cannot be empty'), {
        message: 'Hobby must be an array of strings',
      })
      .optional(),

    // প্রফেশনাল ফিল্ডসমূহ (সাইকোলজিস্টদের জন্য)
    yearsOfExperience: z
      .number()
      .int('Years of experience must be a whole number')
      .min(0, 'Years of experience cannot be negative')
      .max(100, 'Years of experience seems invalid')
      .optional(),
    areaOfExpertise: z
      .array(z.string(), {
        message: 'Area of expertise must be an array of strings',
      })
      .optional(),
    companyName: z
      .string()
      .min(1, 'Company name cannot be empty')
      .max(200, 'Company name cannot exceed 200 characters')
      .optional(),
    registrationNumber: z
      .string()
      .min(1, 'Registration number cannot be empty')
      .max(100, 'Registration number cannot exceed 100 characters')
      .optional(),
    vatNumber: z
      .string()
      .min(1, 'VAT number cannot be empty')
      .max(50, 'VAT number cannot exceed 50 characters')
      .optional(),
    onlineStatus: z
      .enum(['online', 'offline', 'busy'], {
        message: 'Online status must be online, offline, or busy',
      })
      .optional(),
    callRate: z
      .number()
      .positive('Call rate must be a positive number')
      .max(10000, 'Call rate seems invalid')
      .optional(),
    isCallEnabled: z
      .boolean({
        message: 'Call toggle must be a boolean',
      })
      .optional(),
  }),
});

export const getUsersValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    role: z.string().optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export const getPsychicsValidationSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    category: z.string().optional(),
    onlineStatus: z.enum(['online', 'offline', 'busy'], {
      message: 'Online status must be online, offline, or busy',
    }).optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export const updateCallSettingValidationSchema = z.object({
  body: z.object({
    callRate: z
      .number()
      .nonnegative('Call rate cannot be negative')
      .optional(),
    isCallEnabled: z
      .boolean({
        message: 'Call toggle must be a boolean',
      })
      .optional(),
  }),
});

export const updateOnlineStatusValidationSchema = z.object({
  body: z.object({
    onlineStatus: z.enum(['online', 'offline', 'busy'], {
      message: 'Online status must be online, offline, or busy',
    }),
  }),
});
