import { PrismaClient } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// user.service.ts ফাইলটি ডাটাবেজের সাথে যোগাযোগ করে ইউজার সম্পর্কিত কাজগুলো সম্পন্ন করে।

const prisma = new PrismaClient();

// রেসপন্সে কোন কোন ফিল্ড ফেরত পাঠানো হবে তা নির্দিষ্ট করার জন্য একটি সিলেক্ট অবজেক্ট
const userSelect = {
  id: true,
  email: true,
  name: true,
  fullName: true,
  phoneNumber: true,
  nid: true,
  streetAddress: true,
  city: true,
  zip: true,
  country: true,
  dateOfBirth: true,
  language: true,
  profileImage: true,
  hobby: true,
  role: true,
  status: true,
  isVerified: true,
  referralCode: true,
  aboutMe: true,
  // প্রফেশনাল ফিল্ড
  yearsOfExperience: true,
  areaOfExpertise: true,
  companyName: true,
  registrationNumber: true,
  vatNumber: true,
  onlineStatus: true,
  callRate: true,
  isCallEnabled: true,
  isProfileUpdated: true,
  createdAt: true,
  updatedAt: true,
};

// ১. ইউজারের প্রোফাইল নিয়ে আসা
const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect as any,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

// ২. ইউজারের প্রোফাইল আপডেট করা
const updateProfile = async (userId: number, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // রোল অনুযায়ী কোন কোন ফিল্ড আপডেট করা যাবে তা ফিল্টার করা হচ্ছে
  const allowedFields = getAllowedFieldsForRole(user.role);
  const updateData: any = {};

  for (const key of Object.keys(payload)) {
    if (allowedFields.includes(key)) {
      if (key === 'dateOfBirth' && payload[key]) {
        updateData[key] = new Date(payload[key]);
      } else {
        updateData[key] = payload[key];
      }
    }
  }

  // ইউনিক ফিল্ডগুলোর ডুপ্লিকেট চেক (যেমন- phone, nid)
  const uniquenessChecks: Array<{ field: string; value: any }> = [];
  if (updateData.phoneNumber) uniquenessChecks.push({ field: 'phoneNumber', value: updateData.phoneNumber });
  if (updateData.nid) uniquenessChecks.push({ field: 'nid', value: updateData.nid });

  for (const { field, value } of uniquenessChecks) {
    const existing = await prisma.user.findFirst({
      where: {
        [field]: value,
        id: { not: userId },
      },
    });
    if (existing) {
      throw new ApiError(409, `${field} is already in use by another account`);
    }
  }

  // ডাটাবেজে আপডেট করা হচ্ছে
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateData,
      isProfileUpdated: true,
    } as any,
    select: userSelect as any,
  });

  return updatedUser;
};

// ৩. প্রোফাইল পিকচার আপডেট করা
const uploadProfileImage = async (userId: number, profileImageUrl: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: profileImageUrl } as any,
    select: userSelect as any,
  });

  return updatedUser;
};

// ৪. প্রোফাইল পিকচার ডিলিট করা
const deleteProfileImage = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { profileImage: null } as any,
  });

  return { message: 'Profile image deleted successfully' };
};

// ৫. অ্যাডমিনদের জন্য সকল ইউজার রিটার্ন করা (প্যাজিনেশন ও সার্চ সহ)
const getAllUsers = async (options: any, filters: any) => {
  const { page = 1, limit = 10 } = options;
  const { searchTerm, role } = filters;
  const skip = (page - 1) * limit;

  const whereConditions: any = {};

  if (role) {
    whereConditions.role = role as any;
  }

  if (searchTerm) {
    whereConditions.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { fullName: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const result = await prisma.user.findMany({
    where: whereConditions as any,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' } as any,
    select: userSelect as any,
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

// ৬. সাইকোলজিস্ট পাবলিক ডিরেক্টরি
const getAllPsychicsPublic = async (options: any, filters: any) => {
  const { page = 1, limit = 10 } = options;
  const { searchTerm, onlineStatus } = filters;
  const skip = (page - 1) * limit;

  const whereConditions: any = {
    role: 'PSYCHOLOGIST' as any,
    status: 'ACTIVE' as any,
  };

  if (onlineStatus) {
    whereConditions.onlineStatus = onlineStatus as any;
  }

  if (searchTerm) {
    whereConditions.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { fullName: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const result = await prisma.user.findMany({
    where: whereConditions as any,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' } as any,
    select: userSelect as any,
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

// ৭. সিঙ্গেল সাইকোলজিস্টের প্রোফাইল
const getPsychicProfile = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect as any,
  });

  if (!user || user.role !== ('PSYCHOLOGIST' as any)) {
    throw new ApiError(404, 'Psychologist profile not found');
  }

  return user;
};

// ৮. সিঙ্গেল সাইকোলজিস্টের স্ট্যাটিস্টিকস (যেমন- রেটিং, টোটাল কল)
const getPsychicStats = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || user.role !== ('PSYCHOLOGIST' as any)) {
    throw new ApiError(404, 'Psychologist profile not found');
  }

  // ডাটাবেজের রিলেশন টেবিলগুলো সম্পূর্ণ যুক্ত না হওয়া পর্যন্ত ফেইক/স্ট্যাটিক স্ট্যাটস পাঠানো হচ্ছে
  return {
    rating: 4.8,
    totalCalls: 15,
    totalReviews: 9,
    yearsOfExperience: (user as any).yearsOfExperience || 0,
  };
};

// ৯. অনলাইনের অবস্থা আপডেট করা
const updateOnlineStatus = async (userId: number, onlineStatus: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== ('PSYCHOLOGIST' as any)) {
    throw new ApiError(403, 'Only psychologists can update online status');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { onlineStatus } as any,
    select: userSelect as any,
  });

  return updatedUser;
};

// ১০. কলের সেটিংস আপডেট করা
const updateCallSetting = async (userId: number, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== ('PSYCHOLOGIST' as any)) {
    throw new ApiError(403, 'Only psychologists can update call settings');
  }

  const updateData: any = {};
  if (payload.callRate !== undefined) updateData.callRate = payload.callRate;
  if (payload.isCallEnabled !== undefined) updateData.isCallEnabled = payload.isCallEnabled;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData as any,
    select: userSelect as any,
  });

  return updatedUser;
};

// ১১. প্রোফাইল কমপ্লিট হিসেবে চিহ্নিত করা
const markProfileUpdated = async (userId: number) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isProfileUpdated: true } as any,
    select: userSelect as any,
  });

  return user;
};

// ১২. ইউজার ডিলিট করা (শুধুমাত্র সুপার অ্যাডমিনের জন্য)
const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'User deleted successfully' };
};

// রোল অনুযায়ী কোন কোন ফিল্ড আপডেট করা যাবে তার তালিকা তৈরি করার হেল্পার
const getAllowedFieldsForRole = (role: any): string[] => {
  if (role === ('USER' as any)) {
    return ['fullName', 'dateOfBirth', 'country', 'language', 'hobby', 'aboutMe'];
  }

  if (role === ('PSYCHOLOGIST' as any)) {
    return [
      'fullName',
      'phoneNumber',
      'nid',
      'streetAddress',
      'city',
      'zip',
      'country',
      'dateOfBirth',
      'language',
      'hobby',
      'aboutMe',
      'yearsOfExperience',
      'areaOfExpertise',
      'companyName',
      'registrationNumber',
      'vatNumber',
      'onlineStatus',
      'callRate',
      'isCallEnabled',
    ];
  }

  return ['fullName', 'aboutMe'];
};

export const UserService = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
  getAllUsers,
  getAllPsychicsPublic,
  getPsychicProfile,
  getPsychicStats,
  updateOnlineStatus,
  updateCallSetting,
  markProfileUpdated,
  deleteUser,
};
