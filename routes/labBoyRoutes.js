const express = require("express");
const router = express.Router();
const labBoyController = require("../controller/labBoyController");

// Get all LabBoys
router.get("/get-all-labs", labBoyController.getAllLabs);
// Get all LabBoys
router.get("/get-all-lab-boy", labBoyController.getAllLabBoys);
router.get(
  "/get-all-lab-boys-by-lab-id",
  labBoyController.getAllLabBoysByLabId
);

// Get a LabBoy by ID
router.get("/get-lab-boy/:id", labBoyController.getLabBoyById);

// Create a new LabBoy
router.post("/create-lab-boy", labBoyController.createLabBoy);

// Update a LabBoy by ID
router.put("/update-lab-boy/:id", labBoyController.updateLabBoy);

// Delete a LabBoy by ID
router.delete("/delete-lab-boy/:id", labBoyController.deleteLabBoy);

module.exports = router;
