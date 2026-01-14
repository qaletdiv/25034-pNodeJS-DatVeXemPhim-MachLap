// Controllers/orderController.js
const {
  Order,
  Ticket,
  ShowtimeSeat,
  sequelize,
  ShowTime,
  Payment,
} = require("../Models");
const stripe = require("../config/stripe");
// exports.createOrder = async (req, res, next) => {
//   const t = await sequelize.transaction();

//   try {
//     const userId = req.user.id;
//     const { showtimeId, seatIds } = req.body;

//     if (!seatIds?.length) {
//       return res.status(400).json({
//         message: "Chưa chọn ghế",
//       });
//     }

//     /* 1. Lock seats */
//     const seats = await ShowtimeSeat.findAll({
//       where: {
//         id: seatIds,
//         showtimeId,
//         reservedBy: userId,
//         status: "reserved",
//       },
//       lock: t.LOCK.UPDATE,
//       transaction: t,
//     });

//     if (seats.length !== seatIds.length) {
//       await t.rollback();
//       return res.status(409).json({
//         message: "Có ghế không hợp lệ hoặc đã bị huỷ",
//       });
//     }

//     /* 2. Tính tổng tiền */
//     const totalAmount = seats.reduce((sum, s) => {
//       if (s.seat?.type === "vip") return sum + 120000;
//       if (s.seat?.type === "couple") return sum + 200000;
//       return sum + 100000; // default
//     }, 0);

//     /* 3. Tạo order */
//     const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

//     const order = await Order.create(
//       {
//         userId,
//         showtimeId,
//         totalAmount,
//         status: "pending",
//         expiredAt,
//       },
//       { transaction: t }
//     );

//     /* 4. Tạo ticket */
//     const ticketData = seats.map((seat) => ({
//       orderId: order.id,
//       showtimeSeatId: seat.id,
//       price: totalAmount / seats.length,
//     }));

//     await Ticket.bulkCreate(ticketData, { transaction: t });

//     /* 5. Chuyển ghế -> BOOKED */
//     await ShowtimeSeat.update(
//       {
//         status: "booked",
//         reservedBy: null,
//         reservedUntil: null,
//       },
//       {
//         where: { id: seatIds },
//         transaction: t,
//       }
//     );

//     await t.commit();

//     /* 6. SOCKET REALTIME */
//     const io = req.app.get("io");

//     seatIds.forEach((id) => {
//       io.to(`showtime_${showtimeId}`).emit("seat_booked", {
//         showtimeSeatId: id,
//       });
//     });

//     res.json({
//       message: "Tạo đơn hàng thành công",
//       orderId: order.id,
//       totalAmount,
//     });
//   } catch (err) {
//     await t.rollback();
//     next(err);
//   }
// };

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { showtimeId, seatIds } = req.body;

    if (!seatIds?.length) {
      return res.status(400).json({ message: "Chưa chọn ghế" });
    }

    /* 1. Lock seats */
    const seats = await ShowtimeSeat.findAll({
      where: {
        id: seatIds,
        showtimeId: Number(showtimeId),
        reservedBy: userId,
        status: "reserved",
      },
      lock: t.LOCK.UPDATE,
      transaction: t,
      include: ["seat"],
    });

    if (seats.length !== seatIds.length) {
      await t.rollback();
      return res.status(409).json({
        message: "Ghế không hợp lệ",
      });
    }

    /* 2. Tính tiền */
    const curShowtime = await ShowTime.findOne({
      where: { id: Number(showtimeId) },
    });
    if (!curShowtime) {
      await t.rollback();
      return res.status(404).json({ message: "Showtime không tồn tại" });
    }
    const basePrice = curShowtime.price;

    const totalAmount = seats.reduce((sum, s) => {
      if (s.seat?.type === "vip") return sum + 120000;
      if (s.seat?.type === "couple") return sum + 200000;
      return sum + Number(basePrice);
    }, 0);

    /* 3. create order */
    const order = await Order.create(
      {
        userId,
        showtimeId,
        totalAmount,
        status: "pending",
        expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minute
      },
      { transaction: t }
    );

    /* 4. create payment pending */
    await Payment.create(
      {
        orderId: order.id,
        method: "stripe",
        amount: totalAmount,
        status: "pending",
      },
      { transaction: t }
    );

    /* 5. Stripe PaymentIntent */
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((totalAmount / 24000) * 100), // convert to USD cent
      currency: "usd",
      metadata: {
        orderId: order.id,
      },
    });

    await t.commit();

    res.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }
    next(err);
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "charge.succeeded" || event.type === "charge.updated") {
    const charge = event.data.object;

    console.log("CHARGE STATUS:", charge.status);

    if (charge.status === "succeeded") {
      const orderId =
        charge.metadata?.orderId || charge.payment_intent?.metadata?.orderId;

      await handlePaymentSuccess(orderId, charge.id, charge.amount);
    }
  }

  res.json({ received: true });
};

const handlePaymentSuccess = async (orderId, transactionCode, amount) => {
  const t = await sequelize.transaction();

  console.log("CALL handlePaymentSuccess", orderId);

  try {
    const order = await Order.findByPk(orderId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      return;
    }

    // ❗ Đã xử lý rồi → bỏ qua
    if (order.status === "paid") {
      await t.rollback();
      return;
    }

    // ❗ Hết hạn
    if (order.expiredAt && order.expiredAt < new Date()) {
      await order.update({ status: "cancelled" }, { transaction: t });
      await t.rollback();
      return;
    }

    const payment = await Payment.findOne({
      where: { orderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!payment || payment.status !== "pending") {
      await t.rollback();
      return;
    }

    // ❗ check tiền
    const stripeVnd = Math.round((amount / 100) * 24000);
    const dbAmount = Number(payment.amount);

    const diff = Math.abs(stripeVnd - dbAmount);

    if (diff > 500) {
      // cho lệch tối đa 500đ
      console.log("AMOUNT MISMATCH", stripeVnd, dbAmount);
      await t.rollback();
      return;
    }

    /* 1. Update payment */
    await payment.update(
      {
        status: "success",
        transactionCode,
      },
      { transaction: t }
    );

    /* 2. Update order */
    await order.update({ status: "paid" }, { transaction: t });

    /* 3. Lock seats */
    const seats = await ShowtimeSeat.findAll({
      where: {
        reservedBy: order.userId,
        showtimeId: order.showtimeId,
        status: "reserved",
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!seats.length) {
      throw new Error("Không tìm thấy ghế hợp lệ");
    }

    /* 4. Book ghế */
    for (let s of seats) {
      await s.update(
        { status: "booked", reservedBy: null, reservedUntil: null },
        { transaction: t }
      );
    }

    /* 5. tinh tien */
    const curShowtime = await ShowTime.findOne({
      where: { id: Number(order.showtimeId) },
    });
    if (!curShowtime) {
      await t.rollback();
      return res.status(404).json({ message: "Showtime không tồn tại" });
    }
    const basePrice = curShowtime.price;

    /* 6. create ticket (pending) */
    const ticketData = seats.map((s) => {
      let price = basePrice;

      if (s.seat?.type === "vip") price = 120000;
      if (s.seat?.type === "couple") price = 200000;

      return {
        orderId: order.id,
        showtimeSeatId: s.id,
        price,
      };
    });

    await Ticket.bulkCreate(ticketData, {
      transaction: t,
    });

    await t.commit();
  } catch (err) {
    await t.rollback();
    console.error("Webhook error:", err.message);
  }
};
