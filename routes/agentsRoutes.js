const express = require("express");
const router = express.Router();
const {
  createAppointmentByAgent,
  getAppointmentsForAgent,
  getAgentsByFranchiseLocation,
  getAgentsByLocation,
  getAgentsByPincode,
  createAgent,
  updateAgent,
  deleteAgent,
  getAppointmentsByAgentsId,
  getAgentsByFranchiseId,
  setCommissionForSelectedAgents,
} = require("../controller/agentController");
const { accountMiddleware } = require("../middleware/accoundvalidate");

// POST /api/agent/create-appointment
router.post("/create-appointment", accountMiddleware, createAppointmentByAgent);

// GET /api/agent/get-appointments
router.get(
  "/get-appointments",
  accountMiddleware,

  getAppointmentsForAgent
);

router.get("/agents/:franchiseId", accountMiddleware, getAgentsByFranchiseId);

router.get(
  "/appointments/:agentId",
  accountMiddleware,
  getAppointmentsByAgentsId
);

// POST /api/agent/create
router.post(
  "/create-agent",
  accountMiddleware,

  createAgent
);

// PUT /api/agent/:agentId
router.put(
  "/update-agent/:agentId",
  accountMiddleware,

  updateAgent
);

// DELETE /api/agent/:agentId
router.delete("/delete-agent/:agentId", accountMiddleware, deleteAgent);

router.post("/agents-commission", setCommissionForSelectedAgents);

module.exports = router;
