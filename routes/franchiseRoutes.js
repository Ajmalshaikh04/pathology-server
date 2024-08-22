// routes/franchiseRoutes.js

const express = require("express");
const {
  createFranchise,
  getAllFranchises,
  getFranchiseById,
  updateFranchiseById,
  deleteFranchiseById,
  setCommissionForSelectedFranchises,
} = require("../controller/franchiseController.js");
const { accountMiddleware } = require("../middleware/accoundvalidate");

const router = express.Router();

// POST /api/franchise/create
router.post(
  "/create-franchise",
  accountMiddleware,

  createFranchise
);

// GET /api/franchise
router.get(
  "/get-all-franchises",
  accountMiddleware,

  getAllFranchises
);

// GET /api/franchise/:id
router.get(
  "/get-franchise/:id",
  accountMiddleware,

  getFranchiseById
);

// PUT /api/franchise/:id
router.put(
  "/update-franchise/:id",
  accountMiddleware,

  updateFranchiseById
);

// DELETE /api/franchise/:id
router.delete(
  "/delete-franchise/:id",
  accountMiddleware,

  deleteFranchiseById
);

router.post("/franchises-commission", setCommissionForSelectedFranchises);

module.exports = router;
