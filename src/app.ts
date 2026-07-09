import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mainRouter from './routes/main';

// app.ts ফাইলটি আমাদের মূল Express অ্যাপ্লিকেশনের কনফিগারেশন সেটআপ করার জন্য ব্যবহৃত হয়।
// এখানে আমরা সব গ্লোবাল মিডলওয়্যার (Middleware) যেমন cors, helmet, morgan ইত্যাদি যুক্ত করি।

const app = express();

// Security and utility middlewares
app.use(helmet()); // সিকিউরিটির জন্য কিছু গ্লোবাল হেডার সেট করে
app.use(cors()); // অন্য ডোমেইন থেকে আমাদের API কল করার পারমিশন দেয়
app.use(express.json()); // রিকোয়েস্ট বডি থেকে JSON ডাটা রিসিভ করার জন্য
app.use(express.urlencoded({ extended: true })); // URL encoded ডাটা রিসিভ করার জন্য
app.use(morgan('dev')); // কোন API কল হচ্ছে তার লগ দেখার জন্য

// আমাদের অ্যাপের মেইন রাউট এখানে যুক্ত করা হলো
app.use('/api/v1', mainRouter);

// গ্লোবাল এরর হ্যান্ডলার: যদি কোনো API তে এরর হয়, তবে সেটি এখানে চলে আসবে
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
});

export default app;