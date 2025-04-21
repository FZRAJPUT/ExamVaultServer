// models/otpModel.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  fullname: { type: String, required: true },
  branch: {
    type: String,
    enum: ['CSE', 'ME', 'EE', 'CE'],
    required: true
  },
  createdAt: { type: Date, expires: 300, default: Date.now }, // expires in 5 minutes
});

const otpModel = mongoose.models.otps || mongoose.model("otps", otpSchema);

export default otpModel
