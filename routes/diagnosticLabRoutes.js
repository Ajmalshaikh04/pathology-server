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
  toggleHandleView,
  getHandleViewTrueLabs,
  getLabBoyByLabId,
  assignLabBoy,
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

router.put("/toggle-handle-view/:labId", accountMiddleware, toggleHandleView);

router.get("/handle-view-labs", accountMiddleware, getHandleViewTrueLabs);
router.get(
  "/get-lab-boy-by-lab-id/:labId",
  accountMiddleware,
  getLabBoyByLabId
);

// Route to assign a lab boy to a specific appointment
router.put("/assign-lab-boy-to-appointment", assignLabBoy);

module.exports = router;
