const mongoose = require("mongoose")

const clubSchema = new mongoose.Schema({
    societyName:{
        type:String,
        enum:["Cultural","Technical","MOE"],
        default:"Cultural",
        required:true
    },
    clubName:{
        type:String,
        required:true
    },
    users:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }]
})

const Club = mongoose.model("Club",clubSchema)
module.exports = Club