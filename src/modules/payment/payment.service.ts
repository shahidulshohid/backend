import { PrismaClient, PayoutStatus, PaymentMethodType } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// payment.service.ts ফাইলটি ইউজারের টপআপ (TopUp), পেআউট (Payout Request) এবং সেভড পেমেন্ট মেথড পরিচালনা করে।

const prisma = new PrismaClient();

// ১. ওয়ালেট টপআপ করার জন্য Intent তৈরি বা সিমুলেশন
const createTopUp = async (userId: number, amount: number, currency: string = 'EUR') => {
  const euroAmount = amount; // ১:১ ধরে

  const topup = await prisma.topUp.create({
    data: {
      userId,
      amount,
      currency,
      euroAmount,
      status: 'PENDING',
      stripePaymentIntentId: `pi_mock_${Date.now()}`,
    },
  });

  return topup;
};

// ২. টপআপ কনফার্ম করা এবং ওয়ালেটে ব্যালেন্স রিচার্জ করা
const confirmTopUp = async (userId: number, topUpId: number) => {
  const topup = await prisma.topUp.findUnique({
    where: { id: topUpId },
  });

  if (!topup || topup.userId !== userId) {
    throw new ApiError(404, 'টপআপ ডাটা পাওয়া যায়নি');
  }

  if (topup.status === 'COMPLETED') {
    throw new ApiError(400, 'এই টপআপটি ইতিমধ্যে সম্পন্ন হয়েছে');
  }

  const result = await prisma.$transaction(async (tx) => {
    // TopUp স্টেটাস আপডেট করা
    const updatedTopup = await tx.topUp.update({
      where: { id: topUpId },
      data: { status: 'COMPLETED' },
    });

    // ইউজারের ওয়ালেট আনা বা তৈরি করা
    let wallet = await tx.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({ data: { userId, balance: 0 } });
    }

    // ওয়ালেটে ব্যালেন্স রিচার্জ করা
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: topup.euroAmount } },
    });

    // লেনদেনের হিস্ট্রি যুক্ত করা
    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        topupId: topup.id,
        amount: topup.euroAmount,
        type: 'TOPUP',
        status: 'COMPLETED',
        description: `Wallet top-up of ${topup.amount} ${topup.currency}`,
      },
    });

    return { topup: updatedTopup, wallet: updatedWallet };
  });

  return result;
};

// ৩. সাইকোলজিস্ট কর্তৃক উপার্জন উইথড্র/পেআউট রিকুয়েস্ট করা
const requestPayout = async (userId: number, requestedAmount: number, paymentMethodId?: number) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet || wallet.balance < requestedAmount) {
    throw new ApiError(400, 'উইথড্র করার জন্য আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই');
  }

  const payout = await prisma.payoutRequest.create({
    data: {
      userId,
      paymentMethodId,
      requestedAmount,
      status: PayoutStatus.PENDING,
    },
  });

  return payout;
};

// ৪. সাইকোলজিস্টের উইথড্র/পেআউট রিকুয়েস্ট হিস্ট্রি দেখা
const getMyPayoutRequests = async (userId: number) => {
  const requests = await prisma.payoutRequest.findMany({
    where: { userId },
    include: { paymentMethod: true },
    orderBy: { createdAt: 'desc' },
  });

  return requests;
};

// ৫. পেমেন্ট মেথড (কার্ড/ব্যাংক) যোগ করা
const createPaymentMethod = async (userId: number, payload: {
  type: PaymentMethodType;
  stripePaymentMethodId?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
  accountLast4?: string;
  accountHolderName?: string;
}) => {
  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      userId,
      ...payload,
    },
  });

  return paymentMethod;
};

// ৬. সেভ করা পেমেন্ট মেথডগুলো দেখা
const getMyPaymentMethods = async (userId: number) => {
  const methods = await prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return methods;
};

export const PaymentService = {
  createTopUp,
  confirmTopUp,
  requestPayout,
  getMyPayoutRequests,
  createPaymentMethod,
  getMyPaymentMethods,
};
