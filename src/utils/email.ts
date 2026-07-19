// import nodemailer from 'nodemailer';

// // email.ts ফাইলটি মূলত ইমেইল পাঠানোর কাজ করে। 
// // ইউজারের কাছে OTP পাঠানোর জন্য আমরা nodemailer নামের একটি প্যাকেজ ব্যবহার করেছি।

// export const sendOtpEmail = async (email: string, otp: string) => {
//   try {
//     // ইমেইল পাঠানোর জন্য কনফিগারেশন সেটআপ করা হচ্ছে
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // আমরা জিমেইল ব্যবহার করছি
//       auth: {
//         user: process.env.EMAIL_USER, // .env ফাইলে থাকা ইমেইল
//         pass: process.env.EMAIL_PASS, // .env ফাইলে থাকা পাসওয়ার্ড
//       },
//     });

//     // ইমেইলের বডি এবং সাবজেক্ট কী হবে তা এখানে বলা হচ্ছে
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your Registration OTP',
//       text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
//     };

//     // অবশেষে ইমেইল সেন্ড করা হচ্ছে
//     await transporter.sendMail(mailOptions);
//     console.log(`OTP sent to ${email}`);
//   } catch (error) {
//     // console.error('Error sending OTP email:', error);
//     throw new Error('Failed to send OTP email');
//   }
// };






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
        pass: process.env.EMAIL_PASS, // .env ফাইলে থাকা পাসওয়ার্ড
      },
    });

    // সুন্দর HTML টেমপ্লেট - OTP প্রতিটা digit আলাদা বক্সে দেখানো হচ্ছে
    // const otpDigits = otp.split('').join(' ');

    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: 'Segoe UI', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 30px; text-align:center;">
                  <h1 style="color:#ffffff; margin:0; font-size:22px;">Verify Your Account</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 35px 30px; text-align:center;">
                  <p style="color:#333333; font-size:15px; margin: 0 0 20px 0;">
                    Please use the OTP code below to complete your registration.
                  </p>

                  <!-- OTP Box -->
                  <div style="background-color:#f4f4f7; border: 1px dashed #6366f1; border-radius: 8px; padding: 18px; margin: 10px 0 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color:#4f46e5;">
                      ${otp}
                    </span>
                  </div>

                  <p style="color:#888888; font-size:13px; margin: 0 0 25px 0;">
                    This code will remain valid for <strong>10 minutes</strong>. Please do not share it with anyone.
                  </p>

                  <hr style="border:none; border-top:1px solid #eeeeee; margin: 20px 0;" />

                  <p style="color:#aaaaaa; font-size:12px; margin:0;">
                    If you did not make this request, please ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#fafafa; padding: 18px; text-align:center;">
                  <p style="color:#bbbbbb; font-size:11px; margin:0;">
                    &copy; ${new Date().getFullYear()} Practice Backend. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // ইমেইলের বডি এবং সাবজেক্ট কী হবে তা এখানে বলা হচ্ছে
    const mailOptions = {
      from: `"Practice Backend" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code (OTP)',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // fallback plain text
      html: htmlTemplate, // সুন্দর HTML ভার্সন
    };

    // অবশেষে ইমেইল সেন্ড করা হচ্ছে
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};