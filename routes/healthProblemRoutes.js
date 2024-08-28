const express = require("express");
const {
  createHealthProblem,
  getAllHealthProblems,
  getHealthProblemById,
  updateHealthProblem,
  deleteHealthProblem,
} = require("../controller/healthProblemController");

const router = express.Router();

router.post("/health-problems", createHealthProblem);
router.get("/health-problems", getAllHealthProblems);
router.get("/health-problems/:id", getHealthProblemById);
router.put("/health-problems/:id", updateHealthProblem);
router.delete("/health-problems/:id", deleteHealthProblem);

module.exports = router;
