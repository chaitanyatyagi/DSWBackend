const dotenv = require("dotenv")
const path = require("path")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 1100
const mongoose = require("mongoose")
const cors = require("cors")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const AppError = require("./utils/AppError")
const authRouter = require("./routes/authRouter")
const userRouter = require("./routes/userRouter")

dotenv.config({
    path:"./config.env"
})

app.use(cors())
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(cookieparser())

const DB = process.env.DATABASE
mongooseOptions = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 3,
  }

mongoose.connect(DB,mongooseOptions).then(()=>{
    console.log("Database Connected !")
}).catch((error)=>{
    console.log(error)
})

app.use("/users",authRouter)
app.use("/usersAction",userRouter)
app.use("*",(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} in this server`))
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})