import userModel from "../models/userModel.js";

const registerUser = async (req, res) => {
  const { fullname, email, branch } = req.body;

  try {
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({ success: true, message: "Email is already in use" });
    }

    const newUser = new userModel({
      fullname,
      email,
      branch,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registered successfully.",
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export default registerUser;
