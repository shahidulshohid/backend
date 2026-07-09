// apiError.ts ফাইলটি কাস্টম এরর (Error) তৈরি করার জন্য ব্যবহৃত হয়।
// যখনই আমাদের সিস্টেমে কোনো সমস্যা হবে, আমরা এই ক্লাসের মাধ্যমে একটি সুন্দর এরর রেসপন্স পাঠাতে পারব।

export class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false; // Error হলে success সব সময় false হবে
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}