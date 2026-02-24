import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerMiddleware = async (req, res, next) => {
  try {
    const { email, name, username, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user)
      return res
        .status(401)
        .send({ message: "User Already exist", success: false });
    if (!email || !name || !username || !password)
      return res
        .status(401)
        .send({ message: "All fields are required", success: false });
    next();
  } catch (error) {
    res.send({ messgae: "Something Went wrong!", error });
  }
};

export const loginMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .send({ message: "User not found!!", success: false });
    if (!email || !password)
      return res
        .status(401)
        .send({ message: "All fileds are required!", success: false });
    next();
  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
};

export const isLoggedIn = async (req, res, next) => {
  // try {
  //     const token = req.cookies.token;
  //     if(!token) return res.status(401).send({message:"Unauthorized! Please login first.",success:false})
  //     const decoded = jwt.verify(token,process.env.JWT_SECRET);
  //     req.user = decoded;
  //     next();
  // } catch (error) {
  //     console.log(error.message)
  //     return res.status(500).send({message:"Server Error",success:false})
  // }
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({
          message: "Access Token is missing or invalid!",
          success: false,
        });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(400)
            .send({
              message:
                "Access Token has expired, use refreshtoken to generate again",
              success: false,
            });
        }
        return res
          .status(400)
          .send({
            message: "Access token is missing or invalid!",
            success: false,
          });
      }
      const { id } = decoded;
      const user = await userModel.findById(id);
      if (!user)
        return res
          .status(404)
          .send({ message: "User not found!!", success: false });
      req.user = user;
      req.userId = user._id;
      next();
    });
  } catch (error) {
    return res.status(401).send({ message: error.message, success: false });
  }
};

export const verifyOtpMiddleware = async (req, res, next) => {
  const { otp } = req.body;
  if (!otp)
    return res
      .status(401)
      .send({ message: "otp is required!!", success: false });
  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .send({ message: "User not found!", success: false });
    if (!user.otp || !user.otpExpiry)
      return res
        .status(401)
        .send({
          message: "otp not generated or already verified!",
          success: false,
        });
    if (user.otpExpiry > new Date())
      return res
        .status(400)
        .send({ message: "OTP has expired. Please request a new one." });
    if (otp !== user.otp)
      return res.status(401).send({ message: "Invalid Otp", success: false });
    next();
  } catch (error) {
    res.status(500).send({ message: "Server Error!", error });
  }
};
