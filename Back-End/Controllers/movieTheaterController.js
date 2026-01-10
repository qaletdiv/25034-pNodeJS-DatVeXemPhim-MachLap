const { MovieTheater } = require("../Models");

exports.getAllMovieTheater = async (req, res, next) => {
  try {
    const movieTheater = await MovieTheater.findAll({});
    res.status(200).json(movieTheater);
  } catch (err) {
    next(err);
  }
};

// exports.getDetailCategory = async (req, res, next) => {
//   const categoryId = Number(req.params.id);
//   if (isNaN(categoryId)) {
//     res.status(400).send("ID Khong hop le !!!");
//   }
//   try {
//     const category = await Category.findByPk(categoryId);
//     if (!category) {
//       res.status(404).send("Khong tim thay san pham !!!");
//     }
//     res.json(category);
//   } catch (err) {
//     next(err);
//   }
// };

exports.createMovieTheater = async (req, res, next) => {
  try {
    const newMovieTheater = await MovieTheater.create(req.body);
    res.status(201).json(newMovieTheater);
  } catch (err) {
    next(err);
  }
};

exports.updateMovieTheater = async (req, res, next) => {
  const movieTheaterId = Number(req.params.id);
  try {
    const [updateRows] = await MovieTheater.update(req.body, {
      where: { id: movieTheaterId },
    });
    if (updateRows === 0) {
      return res.status(404).send("Không tìm thấy rạp phim !!!");
    }
    const updateTheater = await Category.findByPk(movieTheaterId);
    res.status(200).json(updateTheater);
  } catch (err) {
    next(err);
  }
};

exports.deleteMovieTheater = async (req, res, next) => {
  const movieTheaterId = Number(req.params.id);
  try {
    const deleteRows = await MovieTheater.destroy({
      where: { id: movieTheaterId },
    });
    if (deleteRows === 0) {
      return res.status(404).send("Không tìm thấy rạp phim !!!");
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
