const { Category, Movie, ShowTime, Room, MovieTheater } = require("../Models");
const { Op } = require("sequelize");

exports.getAllMovie = async (req, res, next) => {
  try {
    const { category, title, format, status, theater } = req.query;

    const where = {};
    const include = [];

    if (category && category.trim() !== "") {
      const categoryIds = category.split(",").map(Number);

      include.push({
        model: Category,
        as: "categories",
        through: { attributes: [] },
        where: { id: { [Op.in]: categoryIds } },
      });
    }

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }

    if (format && format.trim() !== "") {
      where.format = format;
    }

    let showtimeInclude = null;

    if (status === "now" || theater) {
      showtimeInclude = {
        model: ShowTime,
        as: "showtimes",
        required: status === "now", // now = INNER JOIN
        where: {},
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
      };

      if (status === "now") {
        showtimeInclude.where.startTime = {
          [Op.lte]: new Date(),
        };
      }

      if (theater && theater.trim() !== "") {
        showtimeInclude.include[0].include[0].where = {
          id: Number(theater),
        };
      }

      include.push(showtimeInclude);
    }

    /* ===== COMING SOON ===== */
    if (status === "soon") {
      where.release_date = { [Op.gt]: new Date() };
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

// exports.getDetailFilm = async (req, res, next) => {
//     const filmId = Number(req.params.id);
//     if (isNaN(filmId)) {
//         res.status(400).send("ID Khong hop le !!!");
//     }
//     try {
//         const film = await Film.findByPk(filmId, {
//             include: [
//                 {
//                     model: Category,
//                     as: "category"
//                 }
//             ]
//         });
//         if (!film) {
//             res.status(404).send("Khong tim thay phim !!!");
//         }
//         res.json(film);

//     } catch (err) {
//         next(err)
//     }
// }

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
