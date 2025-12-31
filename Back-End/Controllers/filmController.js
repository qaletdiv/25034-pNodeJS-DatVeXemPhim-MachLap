const { Film, Category } = require("../Models");
const { Op } = require("sequelize");

exports.getAllFilm = async (req, res, next) => {
    const where = {};
    const include = [];
    const category = req.query.category || "";
    const titleSearch = req.query.title || "";
    const formatSearch = req.query.format || "";

    if (req.query.category) {
        const categoryIds = category.split(","); //cắt chuỗi "1,2" → [1,2]

        include.push({
            model: Category,
            where: { id: { [Op.in]: categoryIds } },
            through: { attributes: [] } // Không lấy dữ liệu từ bảng trung gian
        });
    }
    if (req.query.title) {
        where.title = { [Op.like]: `%${titleSearch}%` };
    }
    if (req.query.format) {
        where.format = formatSearch;
    }

    try {
        const films = await Film.findAll({
            where,
            include
        });
        res.json(films);

    } catch (err) {
        next(err);
    }
}

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

exports.createFilm = async (req, res, next) => {

    try {
        const newFilm = await Film.create(req.body);
        res.status(201).json(newFilm);

    } catch (err) {
        next(err)
    }
}

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