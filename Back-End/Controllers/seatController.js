const { ShowtimeSeat, Seat, sequelize } = require("../Models");

exports.getSeatsByShowtime = async (req, res, next) => {
  try {
    const { showtimeId } = req.params;

    const seats = await ShowtimeSeat.findAll({
      where: { showtimeId },
      include: [
        {
          model: Seat,
          as: "seat",
          attributes: ["id", "seatNumber", "type"],
        },
      ],
      order: [[{ model: Seat, as: "seat" }, "seatNumber", "ASC"]],
    });

    res.status(200).json(seats);
  } catch (err) {
    next(err);
  }
};

exports.holdSeat = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { showtimeSeatId } = req.params;
    const userId = req.user.id;

    // 🔥 LOCK ROW
    const seat = await ShowtimeSeat.findOne({
      where: { id: showtimeSeatId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!seat) {
      await t.rollback();
      return res.status(404).json({
        message: "Không tìm thấy ghế",
      });
    }

    if (seat.status !== "available") {
      await t.rollback();
      return res.status(409).json({
        message: "Ghế đã được giữ hoặc bán",
      });
    }

    const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minute

    await seat.update(
      {
        status: "reserved",
        reservedUntil: expiredAt,
        reservedBy: userId,
      },
      { transaction: t }
    );

    await t.commit();

    // 🔥 SOCKET EMIT
    const io = req.app.get("io");
    io.to(`showtime_${seat.showtimeId}`).emit("seat_reserved", {
      showtimeSeatId: seat.id,
      userId,
      expiredAt,
    });

    res.json({
      message: "Giữ ghế thành công",
      showtimeSeatId: seat.id,
      expiredAt,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// exports.releaseSeat = async (req, res, next) => {
//   const t = await sequelize.transaction();

//   try {
//     const { showtimeSeatId } = req.params;
//     const userId = req.user.id;

//     // 🔒 chỉ user giữ ghế mới được huỷ
//     const [affectedRows] = await ShowtimeSeat.update(
//       {
//         status: "available",
//         reservedUntil: null,
//         reservedBy: null,
//       },
//       {
//         where: {
//           id: showtimeSeatId,
//           status: "reserved",
//           reservedBy: userId,
//         },
//         transaction: t,
//       }
//     );

//     if (affectedRows === 0) {
//       await t.rollback();
//       return res.status(403).json({
//         message: "Không có quyền huỷ ghế này",
//       });
//     }

//     const seat = await ShowtimeSeat.findByPk(showtimeSeatId, {
//       transaction: t,
//     });

//     await t.commit();

//     // 🔥 SOCKET EMIT
//     const io = req.app.get("io");
//     io.to(`showtime_${seat.showtimeId}`).emit("seat_released", {
//       showtimeSeatId,
//       userId,
//     });

//     res.json({
//       message: "Huỷ giữ ghế thành công",
//       showtimeSeatId,
//     });
//   } catch (err) {
//     await t.rollback();
//     next(err);
//   }
// };

exports.releaseSeat = async (req, res) => {
  const { showtimeSeatId } = req.params;
  const userId = req.user.id;

  const seat = await ShowtimeSeat.findOne({
    where: {
      id: showtimeSeatId,
      reservedBy: userId, // chỉ chủ mới huỷ
    },
  });

  if (!seat) {
    return res.status(403).json({
      message: "Bạn không có quyền huỷ ghế này",
    });
  }

  await seat.update({
    status: "available",
    reservedUntil: null,
    reservedBy: null,
  });

  const io = req.app.get("io");

  // 🔥 PHẢI EMIT
  io.to(`showtime_${seat.showtimeId}`).emit("seat_released", {
    showtimeSeatId,
  });

  res.json({ message: "Huỷ giữ ghế thành công" });
};
