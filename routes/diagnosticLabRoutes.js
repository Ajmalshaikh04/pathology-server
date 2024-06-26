// routes/diagnosticLabRoutes.js
const express = require("express");
const {
  getAllDiagnosticLabs,
  getDiagnosticLabById,
  createDiagnosticLab,
  updateDiagnosticLabById,
  createDiagnosticTest,
} = require("../controller/diagnosticLabController");
const {
  accountMiddleware,
  adminMiddleware,
  superadminMiddleware,
} = require("../middleware/accoundvalidate");

const router = express.Router();

// POST /api/diagnostic-labs
router.post(
  "/create-lab",
  accountMiddleware,
  adminMiddleware,
  superadminMiddleware,
  createDiagnosticLab
);

router.get("/labs", getAllDiagnosticLabs);
router.get("/labs/:id", getDiagnosticLabById);

// PUT /api/diagnostic-labs/labs/:id
router.put(
  "/labs/:id",
  accountMiddleware,
  adminMiddleware,
  superadminMiddleware,
  updateDiagnosticLabById
);

// POST /api/diagnostic-labs/create-test
router.post(
  "/create-test",
  accountMiddleware,
  adminMiddleware,
  superadminMiddleware,
  createDiagnosticTest
);

module.exports = router;
