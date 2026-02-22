import jwt from "jsonwebtoken"

export const AccessToken = (user) => { 
    return jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET);
} 

export const RefreshToken = (user) => { 
    return jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET);
} 