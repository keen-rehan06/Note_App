import generateToken from "../config/jwtToken.js";
import { verifyEmail } from "../config/verifyEmail.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

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
    user.token = token;
    await user.save();
    res
      .status(201)
      .send({
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
      return res
        .status(401)
        .send({
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
    if(!user) return res.status(404).send({message:"User not found",success:false});
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).send({message:`User ${user.name} is Verified Successfully!!`,success:true,})
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({message:"Server Error",success:false})
  }
};

export const login = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
};
