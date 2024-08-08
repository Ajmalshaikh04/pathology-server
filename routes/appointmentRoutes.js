const express = require("express");
const router = express.Router();
const {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getAllAppointmentsByAgent,
  getAllAppointmentsByFranchise,
  getAllAppointmentsBySuperAdmin,
  getAppointmentsByUserId,
  approveAppointment,
  rejectAppointment,
  updateLabTestStatus,
  updateAppointmentCommission,
  updateDefaultCommission,
  updateCommission,
  getLabsByLocation,
  getLabsWithTestsInProgress,
  findAppointmentsByLabAndTestStatus,
} = require("../controller/appointmentController");
const {
  accountMiddleware,
  roleMiddleware,
} = require("../middleware/accoundvalidate");

router.post("/appointments", accountMiddleware, createAppointment);
router.put("/appointments/:id", updateAppointment);
router.put(
  "/appointments/:id/tests/:testId",
  accountMiddleware,
  roleMiddleware("admin", "superAdmin", "councilor", "lab"),
  updateLabTestStatus
);
router.delete("/appointments/:id", deleteAppointment);

router.get("/get-all-appointments", getAllAppointments);
// router.get("/appointments/agent/:agentId", getAllAppointmentsByAgent);
router.get(
  "/appointments/franchise/:franchiseId",
  getAllAppointmentsByFranchise
);
router.get("/appointments/superadmin", getAllAppointmentsBySuperAdmin);
router.get("/appointments/user/:userId", getAppointmentsByUserId);

router.put(
  "/appointments/:appointmentId/labs/:labId/approve",
  approveAppointment
);
router.put(
  "/appointments/:appointmentId/labs/:labId/reject",
  rejectAppointment
);

router.patch(
  "/appointments/:appointmentId/commission",
  accountMiddleware,
  roleMiddleware("superAdmin"),
  updateCommission
);

router.get("/location", getLabsByLocation);

router.get("/get-labs-in-progress", getLabsWithTestsInProgress);
router.get("/appointments/lab/:labId", findAppointmentsByLabAndTestStatus);

module.exports = router;
