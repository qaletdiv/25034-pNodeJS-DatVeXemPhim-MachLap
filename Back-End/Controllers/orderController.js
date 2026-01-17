// Controllers/orderController.js
const {
  Order,
  Ticket,
  ShowtimeSeat,
  sequelize,
  ShowTime,
  Payment,
  Combo,
  OrderCombo,
  Movie,
  Room,
  MovieTheater,
  Seat,
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
    const { showtimeId, seatIds, combos = [] } = req.body;

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

    /* 2. Tính tiền vé */
    const curShowtime = await ShowTime.findOne({
      where: { id: Number(showtimeId) },
    });
    if (!curShowtime) {
      await t.rollback();
      return res.status(404).json({ message: "Showtime không tồn tại" });
    }

    const basePrice = curShowtime.price;

    const ticketTotal = seats.reduce((sum, s) => {
      if (s.seat?.type === "vip") return sum + 120000;
      if (s.seat?.type === "couple") return sum + 200000;
      return sum + Number(basePrice);
    }, 0);

    /* 3. Tính tiền combo */
    let comboTotal = 0;

    if (combos.length) {
      const comboIds = combos.map((c) => c.comboId);

      const dbCombos = await Combo.findAll({
        where: { id: comboIds },
        transaction: t,
      });

      for (const c of combos) {
        const found = dbCombos.find((x) => x.id === c.comboId);
        if (!found) {
          await t.rollback();
          return res.status(404).json({
            message: `Combo ${c.comboId} không tồn tại`,
          });
        }

        comboTotal += found.price * c.quantity;
      }
    }

    const totalAmount = ticketTotal + comboTotal;

    /* 4. create order */
    const order = await Order.create(
      {
        userId,
        showtimeId,
        totalAmount,
        status: "pending",
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      { transaction: t }
    );

    /* 5. insert OrderCombos */
    if (combos.length) {
      const dbCombos = await Combo.findAll({
        where: { id: combos.map((c) => c.comboId) },
        transaction: t,
      });

      for (const c of combos) {
        const found = dbCombos.find((x) => x.id === c.comboId);

        await OrderCombo.create(
          {
            orderId: order.id,
            comboId: found.id,
            quantity: c.quantity,
            price: found.price,
          },
          { transaction: t }
        );
      }
    }

    /* 6. create payment */
    await Payment.create(
      {
        orderId: order.id,
        method: "stripe",
        amount: totalAmount,
        status: "pending",
      },
      { transaction: t }
    );

    /* 7. Stripe */
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((totalAmount / 24000) * 100),
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
    if (!t.finished) await t.rollback();
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

  if (event.type === "payment_intent.succeeded") {
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

    /* ===== 4. CHECK TICKET EXIST ===== */
    const existedTicket = await Ticket.findOne({
      where: { orderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existedTicket) {
      console.log("TICKET EXISTED → SKIP");
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

    // await Ticket.bulkCreate(ticketData, {
    //   transaction: t,
    // });

    await Ticket.bulkCreate(
      ticketData.map((tk) => ({
        ...tk,
        status: "ACTIVE",
        isActive: 1,
      })),
      { transaction: t }
    );

    await t.commit();

    /* ===== SOCKET REALTIME ===== */
    const io = global.io || require("../server").io;

    seats.forEach((s) => {
      io.to(`showtime_${order.showtimeId}`).emit("seat_booked", {
        showtimeSeatId: s.id,
      });
    });
  } catch (err) {
    await t.rollback();
    console.error("Webhook error:", err.message);
  }
};

exports.cancelTicket = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: ShowTime,
          as: "showtime",
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    if (order.status !== "paid") {
      await t.rollback();
      return res.status(400).json({
        message: "Chỉ được hủy vé đã thanh toán",
      });
    }

    /* ===== CHECK TIME ===== */
    const now = new Date();
    const showtime = new Date(order.showtime.startTime);

    const diffMinutes = (showtime.getTime() - now.getTime()) / 1000 / 60;

    if (diffMinutes <= 60) {
      await t.rollback();
      return res.status(400).json({
        message: "Không thể hủy khi sắp tới giờ chiếu",
      });
    }

    /* ===== LẤY TICKET ===== */
    const tickets = await Ticket.findAll({
      where: { orderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const showtimeSeatIds = tickets.map((t) => t.showtimeSeatId);

    /* ===== MỞ GHẾ ===== */
    await ShowtimeSeat.update(
      {
        status: "available",
        reservedBy: null,
        reservedUntil: null,
      },
      {
        where: { id: showtimeSeatIds },
        transaction: t,
      }
    );

    /* ===== XÓA TICKET (QUAN TRỌNG) ===== */
    // await Ticket.destroy({
    //   where: { orderId },
    //   transaction: t,
    // });

    await Ticket.update(
      {
        status: "CANCELLED",
        isActive: 0,
      },
      {
        where: { orderId },
        transaction: t,
      }
    );

    /* ===== UPDATE ORDER ===== */
    await order.update({ status: "cancelled" }, { transaction: t });

    await t.commit();

    /* ===== SOCKET REALTIME ===== */
    const io = global.io || require("../server").io;

    showtimeSeatIds.forEach((id) => {
      io.to(`showtime_${order.showtimeId}`).emit("seat_released", {
        showtimeSeatId: id,
      });
    });

    res.json({
      message: "Hủy vé thành công",
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      message: "Hủy vé thất bại",
    });
  }
};

exports.getMyOrderLatest = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],

      include: [
        // SHOWTIME
        {
          model: ShowTime,
          as: "showtime",
          include: [
            { model: Movie, as: "movie" },
            {
              model: Room,
              as: "room",
              include: [{ model: MovieTheater, as: "movietheater" }],
            },
          ],
        },

        // COMBO
        {
          model: OrderCombo,
          as: "orderCombos",
          include: [{ model: Combo, as: "combo" }],
        },

        // GHẾ - ĐI QUA TICKET
        {
          model: Ticket,
          as: "tickets",
          where: { isActive: 1 },
          required: false,
          include: [
            {
              model: ShowtimeSeat,
              as: "showtimeSeat",
              include: [{ model: Seat, as: "seat" }],
            },
          ],
        },
      ],
    });

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};
