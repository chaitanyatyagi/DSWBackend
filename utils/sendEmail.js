const nodemailer = require("nodemailer")

 module.exports = async(email,html) => {
    try{
        var transporter = nodemailer.createTransport({
            host:process.env.HOST,
            service:process.env.SERVICE,
            post:Number(process.env.EMAIL_PORT),
            secure:Boolean(process.env.SECURE),
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
        })
        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            // subject:"OTP for Email Verification!",
            subject:"HAPPY BIRTHDAY KAVYA !!",
            html:html
        })
        console.log("Email sent Successfully!")
    }catch(error){
        console.log(error)   
    }
 }