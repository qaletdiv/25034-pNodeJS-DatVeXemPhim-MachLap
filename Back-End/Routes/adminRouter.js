const express = require("express");
const router = express.Router();

const adminController = require("../Controllers/adminController");
const authenticateToken = require("../Middlewares/authenticateToken");
const authorizeRole = require("../Middlewares/authorizeRole");
const { Ticket } = require("../Models");

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getDashboard,
);
router.get(
  "/orders",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getOrders,
);
router.post(
  "/refund/:orderId",
  authenticateToken,
  authorizeRole("admin"),
  adminController.refundOrder,
);

module.exports = router;
