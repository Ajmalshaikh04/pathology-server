// routes/diagnosticLabRoutes.js
const express = require("express");
const {
  getAllDiagnosticLabs,
  getDiagnosticLabById,
  createDiagnosticLab,
  updateDiagnosticLabById,
  createDiagnosticTest,
  updateDiagnosticTestById,
  deleteDiagnosticTestById,
  deleteDiagnosticLabById,
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
router.delete("/labs/:id", accountMiddleware, deleteDiagnosticLabById);

// POST /api/diagnostic-labs/create-test
router.post("/create-lab-test", accountMiddleware, createDiagnosticTest);
router.put("/update-lab-test", accountMiddleware, updateDiagnosticTestById);
router.delete(
  "/delete-lab-test-by-id/:id",
  accountMiddleware,
  deleteDiagnosticTestById
);

module.exports = router;
