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
  getAllAgents,
  resendOTP,
  updateProfile,
  getProfile,
} = require("../controller/userControllers");
const {
  accountMiddleware,
  roleMiddleware,
} = require("../middleware/accoundvalidate");

// Register User Route
router.post("/login", logInUser);

// Verify OTP
router.put("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.get("/profile", accountMiddleware, getProfile);
router.put("/profile/update", accountMiddleware, updateProfile);

router.post("/register-admin", registerAdmin);
router.post("/signin-admin", signInAdmin);

// User logout route
router.post("/user-logout", accountMiddleware, logOutUser);

// Admin signout route
router.post(
  "/admin-signout",
  accountMiddleware,
  roleMiddleware(
    "admin",
    "superAdmin",
    "franchise",
    "councilor",
    "lab",
    "agent"
  ),
  signOutAdmin
);

router.get(
  "/all-users",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "franchise", "councilor"),
  getAllUsers
);
router.get(
  "/get-all-agents",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "franchise", "councilor"),
  getAllAgents
);
router.get(
  "/all-councilor",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "franchise", "councilor"),
  getAllCouncilors
);

router.patch(
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
