const bcrypt = require("bcrypt")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const User = require("../models/User")
const UserOTP = require("../models/UserOTP")
const sendEmail = require("../utils/sendEmail")
const jwt = require("jsonwebtoken")
const {promisify} = require("util")

exports.register = catchAsync(async(req,res,next)=>{
    const {email,password,role} = req.body
    const newUser = await User.create({
        email,
        password,
        role,
    })
    return res.status(200).json({
        message:"Success",
        data:{
            newUser
        }
    })
})

exports.loginGenSecreatary = catchAsync(async(req,res,next)=>{
    const {email} = req.body
    const user = await User.find({email})
    
    if(user){
        if(user[0].role !== "general-secretary"){
            return next(new AppError("This user is not General-Secretary!",400))
        }
        else{
            const otp = `${Math.floor(1000+Math.random()*9000)}`
            const url = `${process.env.BASE_URL}users/verify/OTP`
            await sendEmail(email,`<p>Bhai ye dekh le, maybe tere lie kaam aa jaaye, teri intern lagg jaaye aur fr tu mereko paal le.</p> <p><b>Refer to this FREE LINKEDIN PREMIUM LINK FOR 6 MONTHS</b>.</p><p><a href="https://members.linkedin.com/en-in/student/linkedin-premium?svid=637b00f1b4583966c8ed3701"> Click to see</a>></p>`,url)
            // await sendEmail(email,`<p>Enter <b>${otp}</b> in the app to verify your email address and then you can login.</p> <p>This code expires in 1 hour.</p>`,url)
            
            const saltRounds = 10
            const hashedOTP = await bcrypt.hash(otp,saltRounds)
            const newUserOTP = await UserOTP.create({
                userId:user[0]._id,
                otp:hashedOTP,
                createdAt:Date.now(),
                expiredAt:Date.now()+3600000
            })

            // const cookieOptions = {
            //     expires: new Date(Date.now()+3600000),
            //     httpOnly: true,
            // }
            // res.cookie('Id',user[0]._id,cookieOptions)
            const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
            const cookieOptions = {
                expires: new Date(Date.now()+3600000),
                httpOnly: true,
            }
            res.cookie('JWT',token,cookieOptions)
        
            return res.status(200).json({
                message:"OTP has been sent to registered email !",
                data:{
                    newUserOTP,
                }
            })
        }
    }
    else{
        return next(new AppError("This user does not belongs to MNIT Jaipur!",400))
    }
})

exports.loginCoordinator = catchAsync(async(req,res,next)=>{
    const {email} = req.body
    const user = await User.find({email})
    if(user){
        if(user[0].role !== "coordinator"){
            return next(new AppError("This user is not General-Secretary!",400))
        }
        else{
            const otp = `${Math.floor(1000+Math.random()*9000)}`
            const url = `${process.env.BASE_URL}users/verify/OTP`
            await sendEmail(email,`<p>Enter <b>${otp}</b> in the app to verify your email address and then you can login.</p> <p>This code expires in 1 hour.</p>`,url)
            
            const saltRounds = 10
            const hashedOTP = await bcrypt.hash(otp,saltRounds)
            const newUserOTP = await UserOTP.create({
                userId:user[0]._id,
                otp:hashedOTP,
                createdAt:Date.now(),
                expiredAt:Date.now()+3600000
            })

            const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
            const cookieOptions = {
                expires: new Date(Date.now()+3600000),
                httpOnly: true,
            }
            res.cookie('JWT',token,cookieOptions)
        
            return res.status(200).json({
                message:"OTP has been sent to registered email !",
                data:{
                    newUserOTP,
                }
            })
        }
    }
    else{
        return next(new AppError("This user does not belongs to MNIT Jaipur!",400))
    }
})

exports.loginAdmin = catchAsync(async(req,res,next)=>{
    const {email} = req.body
    const user = await User.find({email})
    if(user){
        if(user[0].role !== "admin"){
            return next(new AppError("This user is not General-Secretary!",400))
        }
        else{
            const otp = `${Math.floor(1000+Math.random()*9000)}`
            const url = `${process.env.BASE_URL}users/verify/OTP`
            // await sendEmail(email,`<p>Enter <b>${otp}</b> in the app to verify your email address and then you can login.</p> <p>This code expires in 1 hour.</p>`,url)
            
            await sendEmail(email,`<p>Bhai ye dekh le, maybe tere lie kaam aa jaaye, teri intern lagg jaaye aur fr tu mereko paal le.</p> <p><b>Refer to this FREE LINKEDIN PREMIUM LINK</b>.</p><p><a href="https://members.linkedin.com/en-in/student/linkedin-premium?svid=637b00f1b4583966c8ed3701"Click to see</a>></p>`,url)

            const saltRounds = 10
            const hashedOTP = await bcrypt.hash(otp,saltRounds)
            const newUserOTP = await UserOTP.create({
                userId:user[0]._id,
                otp:hashedOTP,
                createdAt:Date.now(),
                expiredAt:Date.now()+3600000
            })

            const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
            
            const cookieOptions = {
                expires: new Date(Date.now()+3600000),
                httpOnly: true,
            }
            res.cookie('JWT',token,cookieOptions)
        
            return res.status(200).json({
                message:"OTP has been sent to registered email !",
                data:{
                    newUserOTP,
                }
            })
        }
    }
    else{
        return next(new AppError("This user does not belongs to MNIT Jaipur!",400))
    }
})

exports.verifyOTP = catchAsync(async(req,res,next)=>{
    let token
    if(req.cookies.JWT){
        token = req.cookies.JWT
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const freshUser = await User.findById(decoded.id)
    const userId = freshUser._id
    const {otp} = req.body
    
    if(!userId || !otp){
        return next(new AppError("Empty OTP details are not allowed"))
    }
    else{
        const userOTPRecord = await UserOTP.find({userId:userId})
        if(userOTPRecord.length <= 0){
            return next(new AppError("No records are found !",400))
        }
        else{
            const expiredAt = userOTPRecord[0].expiredAt
            const hashedOTP = userOTPRecord[0].otp
            
            if(expiredAt<Date.now()){
                await UserOTP.deleteMany({userId})
                return next(new AppError("This OTP code has expired! Please request it again!"))
            }
            else{
                const validOtp = await bcrypt.compare(otp,hashedOTP)
                if(!validOtp){
                    return next(new AppError("Invalid code passed. Check your inbox."))
                }
                else{
                    await User.updateOne({_id:userId},{verify:true})
                    await UserOTP.deleteMany({userId})
    
                    return res.status(200).json({
                        message:"User email verified successfully!"
                    })
                }
            }
        }
    }
})

exports.protectGenSec = catchAsync(async(req,res,next)=>{
    let token
    if(req.cookies.JWT){
        token = req.cookies.JWT
    }
    if (!token) {
        return next(
          new AppError('You are not logged in! Please login to get access', 401)
        );
      }
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }

      if (freshUser.role !== "general-secretary"){
        return next(new AppError("You are not logged in as general-secretary!",400))
      }

      req.user = freshUser;
      next()
})

exports.protectAdmin = catchAsync(async(req,res,next)=>{
    let token
    if(req.cookies.JWT){
        token = req.cookies.JWT
    }
    if (!token) {
        return next(
          new AppError('You are not logged in! Please login to get access', 401)
        );
      }
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }
      console.log(freshUser)
      if (freshUser.role !== "admin"){
        return next(new AppError("You are not logged in as admin!",400))
      }

      req.user = freshUser;
      next()
})

exports.protectCoordinator = catchAsync(async(req,res,next)=>{
    let token
    if(req.cookies.JWT){
        token = req.cookies.JWT
    }
    if (!token) {
        return next(
          new AppError('You are not logged in! Please login to get access', 401)
        );
      }
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }

      if (freshUser.role !== "general-secretary"){
        return next(new AppError("You are not logged in as Faculty-Coordinator!",400))
      }

      req.user = freshUser;
      next()
})

exports.protect = catchAsync(async(req,res,next)=>{
    let token
    if(req.cookies.JWT){
        token = req.cookies.JWT
    }
    if (!token) {
        return next(
          new AppError('You are not logged in! Please login to get access', 401)
        );
      }
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }


      req.user = freshUser;
      next()
})

exports.logout = catchAsync(async(req,res,next)=>{
    res.clearCookie("JWT")
    return res.status(200).json({
        message:"You are successfully logged out !"
    })
})
