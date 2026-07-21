import { PrismaClient, Role } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// content.service.ts ফাইলটি Terms & Conditions এবং Privacy Policy ডাটাবেজে আপডেট ও রিড করার কাজ করে।

const prisma = new PrismaClient();

// ১. Terms & Conditions ক্রিয়েট অথবা আপডেট করা (Upsert)
const upsertTermsAndConditions = async (payload: { content: string; type: Role }) => {
  const result = await prisma.termsAndConditions.upsert({
    where: {
      type: payload.type,
    },
    update: {
      content: payload.content,
    },
    create: {
      content: payload.content,
      type: payload.type,
    },
  });
  return result;
};

// ২. নির্দিষ্ট রোলের Terms & Conditions পাওয়া
const getTermsAndCondition = async (type: Role = Role.USER) => {
  const result = await prisma.termsAndConditions.findFirst({
    where: {
      type,
    },
  });

  if (!result) {
    throw new ApiError(404, 'শর্তাবলী (Terms and conditions) পাওয়া যায়নি');
  }
  return result;
};

// ৩. Privacy Policy ক্রিয়েট অথবা আপডেট করা (Upsert)
const upsertPrivacyPolicy = async (payload: { content: string; type: Role }) => {
  const result = await prisma.privacyPolicy.upsert({
    where: {
      type: payload.type,
    },
    update: {
      content: payload.content,
    },
    create: {
      content: payload.content,
      type: payload.type,
    },
  });
  return result;
};

// ৪. নির্দিষ্ট রোলের Privacy Policy পাওয়া
const getPrivacyPolicy = async (type: Role = Role.USER) => {
  const result = await prisma.privacyPolicy.findFirst({
    where: {
      type,
    },
  });

  if (!result) {
    throw new ApiError(404, 'প্রাইভেসি পলিসি (Privacy policy) পাওয়া যায়নি');
  }
  return result;
};

export const ContentService = {
  upsertTermsAndConditions,
  getTermsAndCondition,
  upsertPrivacyPolicy,
  getPrivacyPolicy,
};
