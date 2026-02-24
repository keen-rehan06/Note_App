import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

export const sendOtpMail = async (email,otp) => {
const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    }
})
const mailOptions = {
    from:process.env.MAIL_USER,
    to:email,
    subject:"Password reset otp.",
    html:`<p>Your Otp for password reset is:<b>${otp}</b>. It is vaid for 10 minutes.</p>`
}
  transport.sendMail(mailOptions,(err,res)=>{
     if(err) return res.send("Email could not sent due to error: ",err);
     res.send("Email has been sent successfully");
 })
}

