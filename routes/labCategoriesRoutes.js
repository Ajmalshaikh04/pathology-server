const express = require("express");
const router = express.Router();
const labCategoriesController = require("../controller/labCategoriesController"); // Adjust the path according to your project structure

router.post("/lab-test/", labCategoriesController.createLabCategory);
router.get("/lab-test/", labCategoriesController.getLabCategories);
router.get("/lab-test/:id", labCategoriesController.getLabCategoryById);
router.put("/lab-test/:id", labCategoriesController.updateLabCategory);
router.delete("/lab-test/:id", labCategoriesController.deleteLabCategory);

module.exports = router;
