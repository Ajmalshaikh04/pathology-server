const express = require("express");
const router = express.Router();

const {
  logInUser,
  verifyOTP,
  registerAdmin,
  signInAdmin,
  getAllUsers,
  getAllCouncilors,
  logOutUser,
  signOutAdmin,
  assignCounselor,
  getAllAssignedUsersByCounselorId,
} = require("../controller/userControllers");
const {
  accountMiddleware,
  roleMiddleware,
} = require("../middleware/accoundvalidate");

// Register User Route
router.post("/login", logInUser);

// Verify OTP
router.put("/verify-otp", verifyOTP);

router.post("/register-admin", registerAdmin);
router.post("/signin-admin", signInAdmin);

// User logout route
router.post("/user-logout", accountMiddleware, logOutUser);

// Admin signout route
router.post(
  "/admin-signout",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "franchise", "councilor"),
  signOutAdmin
);

router.get(
  "/all-users",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "franchise", "councilor"),
  getAllUsers
);
router.get(
  "/all-councilor",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "franchise", "councilor"),
  getAllCouncilors
);

router.put(
  "/assign-counselor",
  accountMiddleware,
  roleMiddleware("superAdmin"),
  assignCounselor
);

router.get(
  "/counselor-assigned-users/:counselorId",
  accountMiddleware,
  roleMiddleware("superAdmin", "councilor"),
  getAllAssignedUsersByCounselorId
);

module.exports = router;
