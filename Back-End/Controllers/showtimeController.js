const moment = require("moment");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const { Room, ShowTime, Movie, MovieTheater } = require("../Models");

const CLEANUP = 15; // cleanup minute

exports.getTheaters = async (req, res) => {
  const data = await MovieTheater.findAll();
  res.json(data);
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

exports.createShowtime = async (req, res) => {
  const { movieId, roomId, startTime } = req.body;

  const movie = await Movie.findByPk(movieId);

  const start = dayjs(startTime);
  const end = start.add(movie.duration + CLEANUP, "minute").toDate();

  // CHECK CONFLICT
  const conflict = await ShowTime.findOne({
    where: {
      roomId,
      [Op.or]: [
        {
          startTime: {
            [Op.between]: [start.toDate(), end],
          },
        },
        {
          endTime: {
            [Op.between]: [start.toDate(), end],
          },
        },
      ],
    },
  });

  if (conflict) return res.status(400).json({ conflict: true });

  const st = await ShowTime.create({
    movieId,
    roomId,
    startTime,
    endTime: end,
    price: 80000,
  });

  res.json(st);
};
