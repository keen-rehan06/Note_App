import generateToken from "../config/jwtToken.js";
import { verifyEmail } from "../config/verifyEmail.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"

export const register = async (req,res) => {
    try {
        const {email,name,username,password} = req.body
       const hash = await bcrypt.hash(password,10)
       const user = await userModel.create({
        email,
        name,
        username,
        password:hash
       })
       const newUser = await userModel.findById(user._id).select("-password");
       const token = generateToken(user);
       verifyEmail(token,email)
       user.token = token;
       await user.save();
       res.status(201).send({message:"User created Successfully",success:true,data:newUser})
    } catch (error) {
        res.status(500).send({success:false,message:"Server Error:",error})
    }
}