const { ShowtimeSeat, sequelize } = require("../Models");
const { Op } = require("sequelize");

module.exports = (io) => {
  setInterval(async () => {
    const t = await sequelize.transaction();

    try {
      const expiredSeats = await ShowtimeSeat.findAll({
        where: {
          status: "reserved",
          reservedUntil: { [Op.lt]: new Date() },
        },
        transaction: t,
      });

      if (expiredSeats.length === 0) {
        await t.commit();
        return;
      }

      const seatIds = expiredSeats.map((s) => s.id);

      // 🔥 UPDATE once – ATOMIC
      await ShowtimeSeat.update(
        {
          status: "available",
          reservedUntil: null,
          reservedBy: null,
        },
        {
          where: {
            id: { [Op.in]: seatIds },
          },
          transaction: t,
        }
      );

      await t.commit();

      // 🔥 SOCKET EMIT AFTER COMMIT
      expiredSeats.forEach((seat) => {
        io.to(`showtime_${seat.showtimeId}`).emit("seat_released", {
          showtimeSeatId: seat.id,
        });
      });
    } catch (err) {
      await t.rollback();
      console.error("❌ Release seat job error:", err);
    }
  }, 60 * 1000); // 1 minute
};
