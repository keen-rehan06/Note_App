import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import handlebars from "handlebars"

const  _filename = fileURLToPath(import.meta.url)
const  _dirname = path.dirname(_filename)

export const verifyEmail = (token,email) => {

    const emailTemplateSource = fs.readFileSync(
        path.join(_dirname,"template.hbs"),
        "utf-8"
    )

    const template = handlebars.compile(emailTemplateSource);
    const htmlTosend = template({token:encodeURIComponent(token)})

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
        html:htmlTosend
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