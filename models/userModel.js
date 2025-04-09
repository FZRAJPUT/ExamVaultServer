import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const userModel = mongoose.models.users || mongoose.model("users", userSchema);

export default userModel;
