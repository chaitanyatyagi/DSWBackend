const mongoose = require("mongoose")
const User = require("./User")

const lostandfoundSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
})

const LostAndFound = mongoose.model('LostAndFound',lostandfoundSchema)
module.exports = LostAndFound