import mongoose from "mongoose";

const userSchma =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:String,
        default:false
    },
    isLoggedin:{
       type:String,
       default:false
    },
    token:{
       type:String,
       default:null
    },
    otp:{
        type:String,
        default:null,
    },
    otpExpiry:{
        type:String,
        default:null,
    },
},{timestamps:true})

const userModel = new mongoose.model("user",userSchma);

export default userModel;