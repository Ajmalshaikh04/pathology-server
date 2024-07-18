const express = require("express");
const router = express.Router();
const location = require("../controller/locationController");

router.post("/get-location", location.getLocationById);

module.exports = router;
