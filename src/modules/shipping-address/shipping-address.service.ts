import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// shipping-address.service.ts ফাইলটি ইউজারের শিপিং ঠিকানা ও ডেলিভারি অ্যাড্রেস ম্যানেজ করে।

const prisma = new PrismaClient();

// ১. আমার সমস্ত শিপিং অ্যাড্রেস দেখা
const getMyShippingAddresses = async (userId: number) => {
  const addresses = await prisma.shippingAddress.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return addresses;
};

// ২. নতুন শিপিং অ্যাড্রেস যুক্ত করা
const createShippingAddress = async (userId: number, payload: {
  fullName: string;
  streetAddress: string;
  country: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  isDefault?: boolean;
}) => {
  if (payload.isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.shippingAddress.create({
    data: {
      userId,
      ...payload,
    },
  });

  return address;
};

// ৩. শিপিং অ্যাড্রেস আপডেট করা
const updateShippingAddress = async (userId: number, id: number, payload: any) => {
  const existing = await prisma.shippingAddress.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new ApiError(404, 'শিপিং ঠিকানা পাওয়া যায়নি');
  }

  if (payload.isDefault) {
    await prisma.shippingAddress.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.shippingAddress.update({
    where: { id },
    data: payload,
  });

  return updated;
};

// ৪. শিপিং অ্যাড্রেস মুছে ফেলা
const deleteShippingAddress = async (userId: number, id: number) => {
  const existing = await prisma.shippingAddress.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    throw new ApiError(404, 'শিপিং ঠিকানা পাওয়া যায়নি');
  }

  await prisma.shippingAddress.delete({ where: { id } });
  return { message: 'শিপিং ঠিকানা মুছে ফেলা হয়েছে' };
};

export const ShippingAddressService = {
  getMyShippingAddresses,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
