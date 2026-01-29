const express = require("express");
const router = express.Router();

const couponController = require("../Controllers/couponController");
const authenticateToken = require("../Middlewares/authenticateToken");

router.get("/", couponController.getCoupon);

module.exports = router;
