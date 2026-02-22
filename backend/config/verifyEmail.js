import nodemailer from "nodemailer"

export const verifyEmail = (token,email) => {
   try {
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
        subject:"No subject yet just testing.",
        text:"Hello world!"
    }
    transport.sendMail(mailOptions,(err,res)=>{
        if(err){
         res.send("Email could not sent due to error: "+error);
         console.log('Error');
       }
         res.send("Email has been sent successfully");
         console.log('mail sent');
    })
   } catch (error) {
    throw new error(error)
   }
}