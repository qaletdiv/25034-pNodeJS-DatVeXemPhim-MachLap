const express = require("express");
const router = express.Router();

const orderController = require("../Controllers/orderController");
const authenticateToken = require("../Middlewares/authenticateToken");
const { Order } = require("../Models");

router.post("/", authenticateToken, orderController.createOrder);

router.get("/my-latest", authenticateToken, async (req, res) => {
  const order = await Order.findOne({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.json(order);
});

module.exports = router;
