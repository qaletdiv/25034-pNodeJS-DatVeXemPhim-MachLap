const { ShowtimeSeat, Seat } = require("../Models");

exports.getSeatsByShowtime = async (req, res) => {
  const { showtimeId } = req.params;

  const seats = await ShowtimeSeat.findAll({
    where: { showtimeId },
    include: [{ model: Seat }],
  });

  res.json(seats);
};

exports.holdSeat = async (req, res) => {
  const { showtimeSeatId } = req.body;
  const io = req.app.get("io");

  const seat = await ShowtimeSeat.findByPk(showtimeSeatId);

  if (!seat || seat.status !== "available") {
    return res.status(400).json({ message: "Ghế đã được chọn" });
  }

  seat.status = "reserved";
  seat.reservedUntil = new Date(Date.now() + 10 * 60 * 1000);
  await seat.save();

  // realtime
  io.to(`showtime_${seat.showtimeId}`).emit("seat_reserved", {
    showtimeSeatId,
  });

  res.json(seat);
};
