const moment = require("moment");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const {
  Room,
  ShowTime,
  Movie,
  MovieTheater,
  Seat,
  ShowtimeSeat,
} = require("../Models");

const CLEANUP = 15; // cleanup minute

exports.getTheaters = async (req, res) => {
  const data = await MovieTheater.findAll();
  res.json(data);
};

exports.getShowtimeSeat = async (req, res) => {
  try {
    const data = await ShowtimeSeat.findAll();

    if (data.length == 0)
      return res.status(404).json({ message: "Không tìm thấy" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGrid = async (req, res) => {
  const { theaterId, date } = req.query;

  if (!theaterId) {
    return res.status(400).json({
      message: "Thiếu theaterId",
    });
  }

  const rooms = await Room.findAll({
    where: { theaterId },
    include: {
      model: ShowTime,
      as: "showtimes",
      where: date
        ? {
            startTime: {
              [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
            },
          }
        : undefined,
      required: false,
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title", "poster", "duration"],
        },
      ],
    },
  });

  res.json(rooms);
};

// exports.createShowtime = async (req, res) => {
//   const { movieId, roomId, startTime } = req.body;

//   const movie = await Movie.findByPk(movieId);

//   const start = dayjs(startTime);
//   const end = start.add(movie.duration + CLEANUP, "minute").toDate();

//   // CHECK CONFLICT
//   const conflict = await ShowTime.findOne({
//     where: {
//       roomId,
//       [Op.or]: [
//         {
//           startTime: {
//             [Op.between]: [start.toDate(), end],
//           },
//         },
//         {
//           endTime: {
//             [Op.between]: [start.toDate(), end],
//           },
//         },
//       ],
//     },
//   });

//   if (conflict) return res.status(400).json({ conflict: true });

//   const st = await ShowTime.create({
//     movieId,
//     roomId,
//     startTime,
//     endTime: end,
//     price: 80000,
//   });

//   res.json(st);
// };

exports.createShowtime = async (req, res, next) => {
  try {
    const { movieId, roomId, startTime } = req.body;

    /* ===== CHECK MOVIE ===== */
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    /* ===== TÍNH END TIME ===== */
    const start = dayjs(startTime);
    const end = start.add(movie.duration + CLEANUP, "minute");

    /* ===== CHECK CONFLICT ===== */
    const conflict = await ShowTime.findOne({
      where: {
        roomId,
        [Op.and]: [
          { startTime: { [Op.lt]: end.toDate() } },
          { endTime: { [Op.gt]: start.toDate() } },
        ],
      },
    });

    if (conflict) {
      return res.status(400).json({ conflict: true });
    }

    /* ===== CREATE SHOWTIME ===== */
    const showtime = await ShowTime.create({
      movieId,
      roomId,
      startTime: start.toDate(),
      endTime: end.toDate(),
      price: 80000,
    });

    /* ===== COPY SEATS → SHOWTIME SEATS ===== */
    const seats = await Seat.findAll({ where: { roomId } });

    const showtimeSeats = seats.map((seat) => ({
      showtimeId: showtime.id,
      seatId: seat.id,
      status: "available",
    }));

    await ShowtimeSeat.bulkCreate(showtimeSeats);

    return res.status(201).json(showtime);
  } catch (err) {
    next(err);
  }
};

exports.updateShowtime = async (req, res) => {
  const { id } = req.params;
  const { roomId, startTime } = req.body;

  const showtime = await ShowTime.findByPk(id, {
    include: [{ model: Movie, as: "movie" }],
  });

  if (!showtime) {
    return res.status(404).json({ message: "Showtime not found" });
  }

  // 👉 Tính lại start & end mới
  const startNew = dayjs(startTime);
  const endNew = startNew.add(showtime.movie.duration + CLEANUP, "minute");

  // 👉 Check conflict (loại trừ chính nó)
  const conflicts = await ShowTime.findOne({
    where: {
      roomId,
      id: { [Op.ne]: id },
    },
    include: [{ model: Movie, as: "movie" }],
  });

  if (conflicts) {
    const sStart = dayjs(conflicts.startTime);
    const sEnd = dayjs(conflicts.endTime);
    // hoặc: sStart.add(conflicts.movie.duration + CLEANUP, "minute")

    if (startNew.isBefore(sEnd) && endNew.isAfter(sStart)) {
      return res.status(409).json({
        conflict: true,
        message: "Trùng giờ chiếu",
      });
    }
  }

  // 👉 UPDATE cả startTime & endTime
  showtime.roomId = roomId;
  showtime.startTime = startNew.toDate();
  showtime.endTime = endNew.toDate();

  await showtime.save();

  res.json(showtime);
};
