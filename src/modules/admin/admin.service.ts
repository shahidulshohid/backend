import { PrismaClient, UserStatus, PsychologistApprovalStatus, Role } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// admin.service.ts ফাইলটি ড্যাশবোর্ড অ্যানালিটিক্স, ইউজার ম্যানেজমেন্ট ও সাইকোলজিস্ট অ্যাপ্রুভাল পরিচালনা করে।

const prisma = new PrismaClient();

// ১. ড্যাশবোর্ড ওভারভিউ পরিসংখ্যান দেখা
const getDashboardOverview = async () => {
  const totalUsers = await prisma.user.count({ where: { role: Role.USER } });
  const totalPsychologists = await prisma.user.count({ where: { role: Role.PSYCHOLOGIST } });
  const pendingApprovals = await prisma.user.count({
    where: { role: Role.PSYCHOLOGIST, approvalStatus: PsychologistApprovalStatus.PENDING_APPROVAL },
  });

  const totalOrders = await prisma.order.count();
  const totalCalls = await prisma.callSession.count();

  // প্ল্যাটফর্ম ইনকাম হিসাব
  const totalRevenue = await prisma.transaction.aggregate({
    where: { type: 'TOPUP', status: 'COMPLETED' },
    _sum: { amount: true },
  });

  return {
    overview: {
      totalUsers,
      totalPsychologists,
      pendingApprovals,
      totalOrders,
      totalCalls,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
  };
};

// ২. সব ইউজারের তালিকা দেখা
const getAllUsers = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    where: { role: Role.USER },
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.user.count({ where: { role: Role.USER } });

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: users,
  };
};

// ৩. সাইকোলজিস্ট আবেদনসমূহ দেখা
const getPsychologists = async (status?: PsychologistApprovalStatus) => {
  const where: any = { role: Role.PSYCHOLOGIST };
  if (status) {
    where.approvalStatus = status;
  }

  const psychologists = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      companyName: true,
      registrationNumber: true,
      yearsOfExperience: true,
      approvalStatus: true,
      rejectionReason: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return psychologists;
};

// ৪. সাইকোলজিস্টকে অ্যাপ্রুভ করা (Approve)
const approvePsychologist = async (psychologistId: number, adminId: number) => {
  const user = await prisma.user.findUnique({ where: { id: psychologistId } });

  if (!user || user.role !== Role.PSYCHOLOGIST) {
    throw new ApiError(404, 'সাইকোলজিস্ট অ্যাকাউন্ট পাওয়া যায়নি');
  }

  const updated = await prisma.user.update({
    where: { id: psychologistId },
    data: {
      approvalStatus: PsychologistApprovalStatus.APPROVED,
      approvedBy: adminId,
      approvalDate: new Date(),
    },
  });

  return updated;
};

// ৫. সাইকোলজিস্ট আবেদন বাতিল করা (Reject)
const rejectPsychologist = async (psychologistId: number, rejectionReason: string) => {
  const user = await prisma.user.findUnique({ where: { id: psychologistId } });

  if (!user || user.role !== Role.PSYCHOLOGIST) {
    throw new ApiError(404, 'সাইকোলজিস্ট অ্যাকাউন্ট পাওয়া যায়নি');
  }

  const updated = await prisma.user.update({
    where: { id: psychologistId },
    data: {
      approvalStatus: PsychologistApprovalStatus.REJECTED,
      rejectionReason,
    },
  });

  return updated;
};

// ৬. ইউজার অ্যাকাউন্ট ব্লক/আনব্লক করা
const updateUserStatus = async (userId: number, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, 'ইউজার পাওয়া যায়নি');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return updated;
};

export const AdminService = {
  getDashboardOverview,
  getAllUsers,
  getPsychologists,
  approvePsychologist,
  rejectPsychologist,
  updateUserStatus,
};
