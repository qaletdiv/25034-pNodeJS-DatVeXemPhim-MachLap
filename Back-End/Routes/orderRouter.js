const express = require("express");
const router = express.Router();

const orderController = require("../Controllers/orderController");
const authenticateToken = require("../Middlewares/authenticateToken");
const { Order } = require("../Models");

router.post("/", authenticateToken, orderController.createOrder);

router.get("/my-latest", authenticateToken, orderController.getMyOrderLatest);

// router.get("/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const order = await Order.findOne({
//     where: { id, userId: req.user.id },
//   });

//   res.json(order);
// });

router.post(
  "/:orderId/cancel",
  authenticateToken,
  orderController.cancelTicket
);

module.exports = router;
