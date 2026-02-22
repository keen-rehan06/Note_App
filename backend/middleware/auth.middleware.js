import userModel from "../models/user.model.js";

export const registerMiddleware = async (req,res,next) => {
try {
    const {email,name,username,password} = req.body;
    const user = await userModel.findOne({email});
    if(user) return res.status(401).send({message:"User Already exist",success:false});
    if(!email ||!name ||!username || !password) return res.status(401).send({message:"All fields are required",success:false});
 next()
} catch (error) {
    res.send({messgae:"Something Went wrong!",error})
}    
}

export const loginMiddleware = async (req,res,next) => {
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email});
        if(!user) return res.status(401).send({message:"User not found!!",success:false});
        if(!email || !password) return res.status(401).send({message:"All fileds are required!",success:false})
        next()
    } catch (error) {
        res.status(500).send({message:error.message,success:false})
    }
}