const mongoose = require("mongoose")
const User = require("./User")

const userOTPVerification = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    otp:String,
    createdAt:Date,
    expiredAt:Date,
})

const UserOTP = mongoose.model('UserOTP',userOTPVerification)
module.exports = UserOTP