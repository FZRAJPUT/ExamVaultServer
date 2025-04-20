// utils/sendOTPEmail.js
import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"ExamVault" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for ExamVault Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4a90e2; padding: 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0;">ExamVault</h1>
          <p style="margin: 0; font-size: 16px;">Secure Access Verification</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px; color: #555;">
            Use the following OTP to complete your verification. This code is valid for the next 5 minutes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4a90e2;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888;">
            If you did not request this, please ignore this email or contact support.
          </p>
        </div>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          © ${new Date().getFullYear()} ExamVault. All rights reserved.
        </div>
      </div>
    `,
  });
  
};
