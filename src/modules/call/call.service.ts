import { PrismaClient, CallStatus } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// call.service.ts ফাইলটি সাইকোলজিস্ট ও ইউজারের অডিও/ভিডিও কল সেশন পরিচালনা করে।

const prisma = new PrismaClient();

// ১. কল শুরু / ইনিশিয়েট করা
const initiateCall = async (callerId: number, receiverId: number) => {
  if (callerId === receiverId) {
    throw new ApiError(400, 'নিজের অ্যাকাউন্টে কল করা যাবে না');
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!receiver) {
    throw new ApiError(404, 'ইউজার পাওয়া যায়নি');
  }

  const channelName = `call_${callerId}_${receiverId}_${Date.now()}`;

  const call = await prisma.callSession.create({
    data: {
      callerId,
      receiverId,
      channelName,
      status: CallStatus.INITIATED,
    },
    include: {
      caller: { select: { id: true, name: true, profileImage: true } },
      receiver: { select: { id: true, name: true, profileImage: true } },
    },
  });

  return call;
};

// ২. কল রিসিভ / একসেপ্ট করা
const acceptCall = async (callId: number, receiverId: number) => {
  const call = await prisma.callSession.findUnique({
    where: { id: callId },
  });

  if (!call || call.receiverId !== receiverId) {
    throw new ApiError(404, 'কল সেশন পাওয়া যায়নি');
  }

  const updated = await prisma.callSession.update({
    where: { id: callId },
    data: {
      status: CallStatus.ACCEPTED,
      startedAt: new Date(),
    },
  });

  return updated;
};

// ৩. কল শেষ করা এবং চার্জ হিসাব করা
const endCall = async (callId: number, userId: number, durationSeconds: number) => {
  const call = await prisma.callSession.findUnique({
    where: { id: callId },
  });

  if (!call) {
    throw new ApiError(404, 'কল সেশন পাওয়া যায়নি');
  }

  const durationMinutes = Math.ceil(durationSeconds / 60);

  // সেশন সেটিংস থেকে রেভিনিউ স্প্লিট নেওয়া
  const settings = await prisma.sessionSettings.findFirst();
  const psychPct = settings?.psychologistPercentage || 70;
  const adminPct = settings?.adminPercentage || 30;

  // সাইকোলজিস্টের কলরেট অনুযায়ী অ্যামাউন্ট হিসাব
  const psychicUser = await prisma.user.findUnique({ where: { id: call.receiverId } });
  const ratePerMin = psychicUser?.callRate || 2;
  const amountSpent = durationMinutes * ratePerMin;

  const psychEarning = (amountSpent * psychPct) / 100;
  const adminEarning = (amountSpent * adminPct) / 100;

  const result = await prisma.$transaction(async (tx) => {
    // ১. কল সেশন শেষ করা
    const updatedCall = await tx.callSession.update({
      where: { id: callId },
      data: {
        status: CallStatus.ENDED,
        endedAt: new Date(),
        duration: durationSeconds,
        amountSpent,
        psychologistEarning: psychEarning,
        adminEarning,
      },
    });

    // ২. কল করার ইউজারের ওয়ালেট থেকে টাকা কেটে নেওয়া
    let callerWallet = await tx.wallet.findUnique({ where: { userId: call.callerId } });
    if (callerWallet) {
      await tx.wallet.update({
        where: { id: callerWallet.id },
        data: { balance: { decrement: amountSpent } },
      });
      await tx.transaction.create({
        data: {
          walletId: callerWallet.id,
          callSessionId: call.id,
          amount: amountSpent,
          type: 'CALL_SESSION',
          status: 'COMPLETED',
          description: `Call session charge for ${durationMinutes} minutes`,
        },
      });
    }

    // ৩. সাইকোলজিস্টের ওয়ালেটে ইয়ার্নিং যুক্ত করা
    let receiverWallet = await tx.wallet.findUnique({ where: { userId: call.receiverId } });
    if (!receiverWallet) {
      receiverWallet = await tx.wallet.create({ data: { userId: call.receiverId, balance: 0 } });
    }
    await tx.wallet.update({
      where: { id: receiverWallet.id },
      data: { balance: { increment: psychEarning } },
    });
    await tx.transaction.create({
      data: {
        walletId: receiverWallet.id,
        callSessionId: call.id,
        amount: psychEarning,
        type: 'CALL_SESSION',
        status: 'COMPLETED',
        description: `Earnings from call session (${durationMinutes} mins)`,
      },
    });

    return updatedCall;
  });

  return result;
};

// ৪. ইউজারের কল হিস্ট্রি দেখা
const getCallHistory = async (userId: number) => {
  const calls = await prisma.callSession.findMany({
    where: {
      OR: [{ callerId: userId }, { receiverId: userId }],
    },
    include: {
      caller: { select: { id: true, name: true, profileImage: true } },
      receiver: { select: { id: true, name: true, profileImage: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return calls;
};

export const CallService = {
  initiateCall,
  acceptCall,
  endCall,
  getCallHistory,
};
