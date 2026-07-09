import nodemailer from 'nodemailer';

// email.ts ফাইলটি মূলত ইমেইল পাঠানোর কাজ করে। 
// ইউজারের কাছে OTP পাঠানোর জন্য আমরা nodemailer নামের একটি প্যাকেজ ব্যবহার করেছি।

export const sendOtpEmail = async (email: string, otp: string) => {
  try {
    // ইমেইল পাঠানোর জন্য কনফিগারেশন সেটআপ করা হচ্ছে
    const transporter = nodemailer.createTransport({
      service: 'gmail', // আমরা জিমেইল ব্যবহার করছি
      auth: {
        user: process.env.EMAIL_USER, // .env ফাইলে থাকা ইমেইল
        pass: process.env.EMAIL_PASS, // .env ফাইলে থাকা পাসওয়ার্ড
      },
    });

    // ইমেইলের বডি এবং সাবজেক্ট কী হবে তা এখানে বলা হচ্ছে
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Registration OTP',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    // অবশেষে ইমেইল সেন্ড করা হচ্ছে
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};
