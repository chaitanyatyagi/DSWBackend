const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")

// For registring
router.route("/register").post(authController.register)

// For logining in
router.route("/login/gen-secreatary").post(authController.loginGenSecreatary)
router.route("/login/coordinator").post(authController.loginCoordinator)
router.route("/login/admin").post(authController.loginAdmin)

// For OTP Verification
router.route("/verifyOTP").post(authController.verifyOTP)

// For logging out
router.route("/logout").get(authController.logout)

module.exports = router