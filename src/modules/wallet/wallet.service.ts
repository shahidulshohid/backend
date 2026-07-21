import { PrismaClient, TransactionType, TransactionStatus } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

// wallet.service.ts ফাইলটি ইউজারের ডিজিটাল ওয়ালেট, লেনদেনের ইতিহাস এবং ব্যালেন্স হ্যান্ডেল করে।

const prisma = new PrismaClient();

// ১. ইউজারের নিজস্ব ওয়ালেট দেখা (না থাকলে নতুন জেনারেট করা)
const getMyWallet = async (userId: number) => {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, balance: 0 },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }

  const transactionSummary = await prisma.transaction.groupBy({
    by: ['type', 'status'],
    where: { walletId: wallet.id },
    _sum: { amount: true },
    _count: { id: true },
  });

  return {
    wallet,
    summary: transactionSummary,
  };
};

// ২. আমার লেনদেনের ইতিহাস দেখা
const getMyTransactions = async (userId: number, query: any) => {
  const wallet = await getMyWallet(userId);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = { walletId: wallet.wallet.id };

  if (query.type) {
    where.type = query.type as TransactionType;
  }

  if (query.status) {
    where.status = query.status as TransactionStatus;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.transaction.count({ where });

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: transactions,
  };
};

// ৩. অ্যাডমিন দ্বারা মানুয়ালি লেনদেন পরিচালনা করা
const createManualTransaction = async (payload: {
  userId: number;
  amount: number;
  type: TransactionType;
  description: string;
}) => {
  const walletData = await getMyWallet(payload.userId);
  const wallet = walletData.wallet;

  if (
    (payload.type === 'WITHDRAWAL' || payload.type === 'PAYMENT') &&
    wallet.balance < payload.amount
  ) {
    throw new ApiError(400, 'ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই');
  }

  const result = await prisma.$transaction(async (tx) => {
    let balanceChange = payload.amount;
    if (payload.type === 'WITHDRAWAL' || payload.type === 'PAYMENT') {
      balanceChange = -payload.amount;
    }

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: balanceChange } },
    });

    const transaction = await tx.transaction.create({
      data: {
        walletId: wallet.id,
        amount: payload.amount,
        type: payload.type,
        status: 'COMPLETED',
        description: payload.description,
      },
    });

    return { transaction, updatedWallet };
  });

  return result;
};

export const WalletService = {
  getMyWallet,
  getMyTransactions,
  createManualTransaction,
};
