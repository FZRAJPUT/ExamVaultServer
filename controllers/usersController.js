import otpModel from "../models/otpModel.js";
import userModel from "../models/userModel.js";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";

export const registerUser = async (req, res) => {
  const { fullname, email, branch } = req.body;

  try {
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res.json({ success: false, message: "Email is already in use" });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in a temporary collection
    await otpModel.insertMany(
      { 
        email, otp: 
        otpCode, 
        fullname, 
        branch, 
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    // Send the OTP to email
    await sendOTPEmail(email, otpCode);

    res.json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
    console.log(error.message);
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await otpModel.findOne({ email });

    if (!record) {
      return res.json({ success: false, message: "OTP expired or invalid" });
    }

    // Compare OTPs as strings or numbers consistently
    if (Number(record.otp) !== Number(otp)) {
      return res.json({ success: false, message: "Incorrect OTP" });
    }

    // Check if the user is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      await otpModel.deleteOne({ email }); // Clean up OTP if exists
      return res.json({ success: false, message: "Email already in use" });
    }

    // Register new user
    const newUser = new userModel({
      fullname: record.fullname,
      email: record.email,
      branch: record.branch,
    });

    await newUser.save();
    await otpModel.deleteOne({ email }); // Clean up OTP after verification

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};


export const userDetails = async (req, res) => {
  const { email } = req.body;
  try {
    const details = await userModel.findOne({ email });

    if (details) {
      return res.json({
        success: true,
        details,
        message: "Login Successfull",
      });
    }

    return res.json({
      success: false,
      message: "Email not Registered!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
