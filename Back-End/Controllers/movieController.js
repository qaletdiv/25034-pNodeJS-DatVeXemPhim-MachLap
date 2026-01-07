const { Category, Movie, ShowTime, Room, MovieTheater } = require("../Models");
const { Op } = require("sequelize");

exports.getAllMovie = async (req, res, next) => {
  try {
    const { category, title, format, status, theater } = req.query;

    const where = {};
    const include = [];

    const now = new Date();

    /* ===== CATEGORY ===== */
    if (category && category.trim() !== "") {
      const categoryIds = category.split(",").map(Number);
      include.push({
        model: Category,
        as: "categories",
        through: { attributes: [] },
        where: { id: { [Op.in]: categoryIds } },
      });
    }

    /* ===== TITLE ===== */
    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }

    /* ===== FORMAT ===== */
    if (format) {
      where.format = format;
    }

    /* ===== SHOWTIME / THEATER ===== */
    if ((status === "now" || theater) && status !== "soon") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const showtimeWhere = {};

      if (status === "now") {
        showtimeWhere.startTime = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      include.push({
        model: ShowTime,
        as: "showtimes",
        required: true, // bắt buộc có suất chiếu
        where: showtimeWhere,
        include: [
          {
            model: Room,
            as: "room",
            required: !!theater,
            include: [
              {
                model: MovieTheater,
                as: "movietheater",
                required: !!theater,
                ...(theater && { where: { id: Number(theater) } }),
              },
            ],
          },
        ],
      });
    }

    /* ===== COMING SOON ===== */
    if (status === "soon") {
      where.release_date = { [Op.gt]: now };
    }

    const movies = await Movie.findAll({
      where,
      include,
      distinct: true,
      order: [["release_date", "ASC"]],
    });

    res.json(movies);
  } catch (err) {
    next(err);
  }
};

exports.getDetailMovie = async (req, res, next) => {
  const filmId = Number(req.params.id);
  if (isNaN(filmId)) {
    res.status(400).send("ID Khong hop le !!!");
  }
  try {
    const film = await Movie.findByPk(filmId, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
        {
          model: ShowTime,
          as: "showtimes",
          required: false,
          include: [
            {
              model: Room,
              as: "room",
              include: [
                {
                  model: MovieTheater,
                  as: "movietheater",
                },
              ],
            },
          ],
        },
      ],
    });
    if (isNaN(filmId)) {
      return res.status(400).send("ID không hợp lệ");
    }
    res.json(film);
  } catch (err) {
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const newFilm = await Movie.create(req.body);
    res.status(201).json(newFilm);
  } catch (err) {
    next(err);
  }
};

// exports.updateFilm = async (req, res, next) => {

//     const productId = Number(req.params.id);
//     try {
//         const [updateRows] = await Product.update(req.body, {
//             where: { id: productId }
//         })
//         if (updateRows === 0) {
//             return res.status(404).send("Khong tim thay san pham !!!");
//         }
//         const updatProduct = await Product.findByPk(productId);
//         res.json(updatProduct)
//     } catch (err) {
//         next(err)
//     }
// }

// exports.deteleFilm = async (req, res, next) => {
//     const productId = Number(req.params.id);
//     try {
//         const deleteRows = await Product.destroy({
//             where: { id: productId }
//         })
//         if (deleteRows === 0) {
//             return res.status(404).send("Khong tim thay san pham !!!");
//         }
//         return res.status(204).send();
//     } catch (err) {
//         next(err)
//     }
// }
