// Controllers/ticketController.js
const { Op } = require("sequelize");
const { Coupon } = require("../Models");

exports.getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();

    res.status(200).json(coupons);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};
