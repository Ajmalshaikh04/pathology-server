const express = require("express");
const router = express.Router();

const {
  logInUser,
  verifyOTP,
  registerAdmin,
  signInAdmin,
  getAllUsers,
} = require("../controller/userControllers");
const {
  accountMiddleware,
  adminMiddleware,
  superadminMiddleware,
} = require("../middleware/accoundvalidate");

// Register User Route
router.post("/login", logInUser);

// Verify OTP
router.put("/verify-otp", verifyOTP);

router.post("/register-admin", registerAdmin);
router.post("/signin-admin", signInAdmin);
router.get(
  "/all-users",
  accountMiddleware,
  adminMiddleware,
  superadminMiddleware,
  getAllUsers
);

module.exports = router;
