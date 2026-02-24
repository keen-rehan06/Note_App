import generateToken from "../config/jwtToken.js";
import { verifyEmail } from "../config/verifyEmail.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import sessionModel from "../models/session.model.js";
import { AccessToken, RefreshToken } from "../config/AccessRefreshToken.js";

export const register = async (req, res) => {
  try {
    const { email, name, username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      name,
      username,
      password: hash,
    });
    const newUser = await userModel.findById(user._id).select("-password");
    const token = await generateToken(user);
    verifyEmail(token, email);
    newUser.token = token;
    await newUser.save();
    res.status(201).send({
      message: "User created Successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, message: "Server Error:", error });
  }
};

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).send({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded", decoded);
    } catch (error) {
      console.log("JWT ERROR NAME:", error.name);
      console.log("JWT ERROR MESSAGE:", error.message);
      return res.status(400).json({
        message: error.message,
        success: false,
      });
    }
    const user = await userModel.findById(decoded.id);
    if (!user)
      return res
        .status(404)
        .send({ message: "User not found", success: false });
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res
      .status(200)
      .send({
        message: `User ${user.name} is Verified Successfully!!`,
        success: true,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Server Error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const result = await bcrypt.compare(password, user.password);
    if (user.isVerified === false) {
      return res.status(401).json({ message: "Email not verified!" });
    }
    if (!result)
      return res
        .status(401)
        .send({ message: "Password is incorrect!!", success: false });
    const token = await generateToken(user);
    res.cookie("token", token);
    const existingSession = await sessionModel.findOne({ userId: user._id });
    if (existingSession) {
      await sessionModel.deleteOne({ userId: user._id });
    }
    await sessionModel.create({ userId: user._id });
    const accessToken = AccessToken(user);
    const refreshToken = RefreshToken(user);
    user.token = null;
    user.isLoggedin = true;
    await user.save();
    const newUser = await userModel.findById(user._id).select("-password");
    return res
      .status(200)
      .send({
        message: "User LoggedIn Successfully!!",
        success: true,
        data: newUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Server error", error });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await sessionModel.deleteMany({ userId });
    await userModel.findByIdAndUpdate(userId, { isLoggedin: false });
    res.clearCookie("token");
    res.status(200).send({
      message: "User Logout Successfully!!",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Server Error:",
      error,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendOtpMail(email,otp)
    res
      .status(200)
      .send({ message: `The otp(One Time Password) ${otp}`, success: true });
  } catch (error) {
    res.status(500).send({ message: "Server Error", success: false });
  }
};
