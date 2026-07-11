import dotenv from 'dotenv';
import app from './app';

// server.ts ফাইলটি শুধুমাত্র আমাদের সার্ভার চালু (Start) করার কাজ করে।
// এটি ডাটাবেজ কানেকশন বা অন্যান্য কনফিগারেশন চেক করে সার্ভারটিকে নির্দিষ্ট একটি পোর্টে লিসেন (Listen) করায়। 

dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();