const express = require("express");
const router = express.Router();
const {
  createReport,
  getReport,
  getAllReports,
  updateReport,
  deleteReport,
  getAllReportsByUserId,
} = require("../controller/reportController");
const { accountMiddleware } = require("../middleware/accoundvalidate");

// Create a new report
router.post("/reports", createReport);

// Get a single report by ID
router.get("/reports/:appointmentId", getReport);

// Get all reports
router.get("/reports", getAllReports);

// Update a report by ID
router.put("/reports/:id", updateReport);

// Delete a report by ID
router.delete("/reports/:id", deleteReport);

router.get("/reports/user/:userId", accountMiddleware, getAllReportsByUserId);

module.exports = router;
