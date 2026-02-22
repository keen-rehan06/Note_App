import userModel from "../models/user.model.js";

export const registerMiddleware = async (req,res) => {
    const {email,name,username,password} = req.body;
    const user = await userModel.findOne({email});
    if(user) return res.status(401).send({message:"User Already exist",success:false});
    if(!email ||!name ||!username || !password) return res.status(401).send({message:"All fields are required",success:false});
}