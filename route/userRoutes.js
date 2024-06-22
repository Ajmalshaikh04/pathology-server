const express = require("express");
const router = express.Router();

const { logInUser, verifyOTP } = require("../controller/userControllers");

// Register User Route
router.post("/login", logInUser);

// Verify OTP
router.put("/verify-otp", verifyOTP);

module.exports = router;
