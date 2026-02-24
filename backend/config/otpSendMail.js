import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

const sendOtpMail = (email,otp) => {
const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    }
})
const mailOptions = 
}

