import jwt from "jsonwebtoken"

export const AccessToken = (user) => { 
    return jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"30s"});
} 

export const RefreshToken = (user) => { 
    return jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"30d"});
} 
