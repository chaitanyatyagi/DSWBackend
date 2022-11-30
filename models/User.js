const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    collegeId:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["general-secretary","coordinator","admin","student"],
        default:"student"
    },
    profile:String,
    position:String,
    description:String,
    verifiy:Boolean,
    cgpa:{
        type:Number,
        max:10,
        min:4
    },
    currentYear:String,
})

const User = mongoose.model("User",userSchema)
module.exports = User