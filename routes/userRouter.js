const express = require("express")
const catchAsync = require("../utils/catchAsync")
const router = express.Router()
const userController = require("../controller/userController")
const authController = require("../controller/authController")

router.route("/addItem").post(authController.protectAdmin,userController.addlostandfound)
router.route("/deleteItem/:id").delete(authController.protectAdmin,userController.deletelostandfound)

// pending
router.route("/upcomingFeed/gen-sec").post(authController.protectGenSec,userController.genSecEvents)
router.route("/upcomingFeed/admin").post(authController.protectAdmin,userController.adminEvents)

// registration of students in respective clubs
router.route("/:societyName/:clubName").patch(authController.protect,userController.clubRegister)
router.route("/:clubName/:studentId").delete(authController.protect,userController.clubDeletion)

module.exports = router