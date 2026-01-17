// Controllers/ticketController.js
const { Op } = require("sequelize");
const { Combo } = require("../Models");

exports.getCombo = async (req, res) => {
  try {
    const combos = await Combo.findAll();

    res.status(200).json(combos);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};
