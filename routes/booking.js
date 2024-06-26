const express = require('express')
const router = express.Router();
const {createAppointemnt}=require("../controller/bookingController")

router.post("/user/appointment",createAppointemnt);


module.exports = router;