const express = require("express");
const router = express.Router();

const showtimeController = require("../Controllers/showtimeController");
const authenticateToken = require("../Middlewares/authenticateToken");
const authorizeRole = require("../Middlewares/authorizeRole");

router.get(
  "/grid",
  authenticateToken,
  authorizeRole("admin"),
  showtimeController.getGrid,
);

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  showtimeController.createShowtime,
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  showtimeController.updateShowtime,
);

router.get(
  "/theaters",
  authenticateToken,
  authorizeRole("admin"),
  showtimeController.getTheaters,
);

router.get(
  "/reservedUntil",
  authenticateToken,
  showtimeController.getShowtimeSeat,
);

module.exports = router;
