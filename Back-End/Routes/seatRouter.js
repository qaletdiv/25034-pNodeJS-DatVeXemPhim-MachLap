const express = require("express");
const router = express.Router();

const seatController = require("../Controllers/seatController");
const authenticateToken = require("../Middlewares/authenticateToken");

router.get(
  "/showtime/:showtimeId",
  authenticateToken,
  seatController.getSeatsByShowtime
);

router.post(
  "/:showtimeSeatId/hold",
  authenticateToken,
  seatController.holdSeat
);

// huỷ giữ ghế (khi user bỏ chọn)
router.post(
  "/:showtimeSeatId/release",
  authenticateToken,
  seatController.releaseSeat
);

// // xác nhận ghế khi thanh toán thành công
// router.post(
//   "/:showtimeSeatId/booked",
//   authenticateToken,
//   seatController.confirmBooking
// );

module.exports = router;
