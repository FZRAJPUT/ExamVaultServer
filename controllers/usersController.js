import userModel from "../models/userModel.js";

export const registerUser = async (req, res) => {
  const { fullname, email, branch } = req.body;

  try {
    const isExist = await userModel.findOne({ email });

    if (isExist) {
      return res
        .status(409)
        .json({ success: true, message: "Email is already in use" });
    }

    const newUser = new userModel({
      fullname,
      email,
      branch,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registered successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const userDetails = async (req, res) => {
  const { email } = req.body;
  try {
    const details = await userModel.findOne({ email });

    if (details) {
      return res.status(201).json({
        success: true,
        details,
      });
    }

    return res.status(409).json({
      success: false,
      message: "Email not Registered!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
