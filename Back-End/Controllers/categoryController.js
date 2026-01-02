const { Category } = require("../Models");

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll({});
    res.json(categories);
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

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const categoryId = Number(req.params.id);
  try {
    const [updateRows] = await Category.update(req.body, {
      where: { id: categoryId },
    });
    if (updateRows === 0) {
      return res.status(404).send("Không tìm thấy thể loại !!!");
    }
    const updatCategory = await Category.findByPk(categoryId);
    res.json(updatCategory);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = Number(req.params.id);
  try {
    const deleteRows = await Category.destroy({
      where: { id: categoryId },
    });
    if (deleteRows === 0) {
      return res.status(404).send("Không tìm thấy thể loại !!!");
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
