const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/AppError")
const LostAndFound = require("../models/LostAndFound") 
const Club = require("../models/Club")

exports.addlostandfound = catchAsync(async(req,res,next)=>{
    const newItem = await LostAndFound.create({
        name:req.body.name,
        description:req.body.description,
        image:req.body.image,
        userId:req.user._id
    })
    return res.status(200).json({
        message:"Your item has been successfully added",
        data:{
            newItem
        }
    })
})

exports.deletelostandfound = catchAsync(async(req,res,next)=>{
    const deletedItem = await LostAndFound.findByIdAndDelete(req.params.id)
    if (!deletedItem){
        return next(new AppError("No such item is found !",404))
    }
    return res.status(200).json({
        message:"Item has been removed successfully !"
    })
})

exports.adminEvents = catchAsync(async(req,res,next)=>{
    // remaining
})

exports.genSecEvents = catchAsync(async(req,res,next)=>{
    // remaining
})

exports.clubRegister = catchAsync(async(req,res,next)=>{
    let newRegistration = await Club.find({clubName:req.params.clubName})
    
    if (newRegistration.length === 0){
            newRegistration = await Club.create({
            societyName:req.params.societyName,
            clubName:req.params.clubName,
            users:[]
        })
    }

    newRegistration = await Club.updateOne({clubName:req.params.clubName},{
        $push:{users:req.user._id}
    },{
        new: true,
        runValidators: true,
    })
    
    return res.status(200).json({
        message:"Wait for approval",
    })
})

exports.clubDeletion = catchAsync(async(req,res,next)=>{
    const deletedStudent = await Club.updateOne({clubName:req.params.clubName},{
        $pull:{users:req.params.studentId}
    })
    return res.status(200).json({
        message:"Student removed successfully."
    })
})