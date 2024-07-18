// routes/diagnosticLabRoutes.js
const express = require("express");
const {
  getAllDiagnosticLabs,
  getDiagnosticLabById,
  createDiagnosticLab,
  updateDiagnosticLabById,
  createDiagnosticTest,
} = require("../controller/diagnosticLabController");
const { accountMiddleware } = require("../middleware/accoundvalidate");

const router = express.Router();

// POST /api/diagnostic-labs
router.post(
  "/create-lab",
  accountMiddleware,

  createDiagnosticLab
);

router.get("/labs", getAllDiagnosticLabs);
router.get("/labs/:id", getDiagnosticLabById);

// PUT /api/diagnostic-labs/labs/:id
router.put("/labs/:id", accountMiddleware, updateDiagnosticLabById);

// POST /api/diagnostic-labs/create-test
router.post("/create-test", accountMiddleware, createDiagnosticTest);

module.exports = router;
