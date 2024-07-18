const express = require("express");
const router = express.Router();
const {
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAllAppointments,
  getAllAppointmentsByAgent,
  getAllAppointmentsByFranchise,
  getAllAppointmentsBySuperAdmin,
  getAppointmentsByUserId,
  approveAppointment,
  rejectAppointment,
} = require("../controller/appointmentController");

router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.put("/appointments/:id/status", updateAppointmentStatus);
router.delete("/appointments/:id", deleteAppointment);

router.get("/get-all-appointments", getAllAppointments);
router.get("/appointments/agent/:agentId", getAllAppointmentsByAgent);
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

module.exports = router;
