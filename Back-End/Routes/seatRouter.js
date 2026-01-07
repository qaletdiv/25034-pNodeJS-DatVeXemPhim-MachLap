const express = require("express");
const router = express.Router();
const seatController = require("../Controllers/seatController");
const authenticateToken = require("../Middlewares/authenticateToken");

router.get(
  "/:showtimeId",
  authenticateToken,
  seatController.getSeatsByShowtime
);

router.post("/hold", authenticateToken, seatController.holdSeat);

module.exports = router;
