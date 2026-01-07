const { ShowtimeSeat, Sequelize } = require("../Models");
const { Op } = Sequelize;

module.exports = (io) => {
  setInterval(async () => {
    try {
      const expiredSeats = await ShowtimeSeat.findAll({
        where: {
          status: "reserved",
          reservedUntil: { [Op.lt]: new Date() },
        },
      });

      for (const seat of expiredSeats) {
        await seat.update({
          status: "available",
          reservedUntil: null,
        });

        // realtime notify
        io.to(`showtime_${seat.showtimeId}`).emit("seat_released", {
          seatId: seat.seatId,
        });
      }
    } catch (err) {
      console.error("Release seat job error:", err);
    }
  }, 60000);
};
