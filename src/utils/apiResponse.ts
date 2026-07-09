// apiResponse.ts ফাইলটি সফল (Success) রেসপন্স পাঠানোর জন্য ব্যবহৃত হয়।
// আমাদের API থেকে কোনো ডাটা সঠিকভাবে ক্লায়েন্টকে পাঠানোর সময় একটি নির্দিষ্ট স্ট্রাকচার ফলো করার জন্য এটি তৈরি করা।

export class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // স্ট্যাটাস কোড ৪০০ এর নিচে হলে বুঝতে হবে রেসপন্স সফল হয়েছে
  }
}