// utils/sendOTPEmail.js
import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use SMTP
    auth: {
      user: "subhashkushwaha148@gmail.com",
      pass: "divtnmctdhgbypnv"
    },
  });

  await transporter.sendMail({
    from: `"NoReply" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'OTP for ExamVault',
    html: `<h2>Your OTP is</h2><p style="font-size:20px;"><b>${otp}</b></p>`,
  });
};

console.log("otp sent");

