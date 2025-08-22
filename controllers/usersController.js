import otpModel from "../models/otpModel.js";
import userModel from "../models/userModel.js";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";
import imagekit from "../utils/imagekit.js"; // Import the configured ImageKit instance

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

export const uploadProfilePicture = async (req, res) => {
  const { email } = req.body;

  // 1. Validate input
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Profile image file is required." });
  }

  try {
    // 2. Find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // 3. Upload file to ImageKit
    const imagekitResponse = await imagekit.upload({
      file: req.file.buffer, // required
      fileName: `profile_${user._id}_${Date.now()}`, // required
      folder: "profile_pictures", // optional
    });

    // 4. Update user's profilePicture field in the database
    user.profilePicture = imagekitResponse.url;
    await user.save();

    res.json({
      success: true,
      message: "Profile picture uploaded successfully.",
      data: {
        url: imagekitResponse.url,
      },
    });

  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during file upload.",
      error: error.message,
    });
  }
};
