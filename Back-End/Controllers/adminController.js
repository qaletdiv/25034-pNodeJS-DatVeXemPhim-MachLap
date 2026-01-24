// controllers/adminController.js
const { Order, Ticket, ShowTime, Movie, sequelize } = require("../Models");
const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {
  try {
    // doanh thu hôm nay
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const revenueToday =
      (await Order.sum("totalAmount", {
        where: {
          status: "paid",
          createdAt: {
            [Op.between]: [start, end],
          },
        },
      })) || 0;

    /* Vé đã bán */
    const totalTickets = await Ticket.count({
      where: { isActive: 1 },
    });

    /* Tỷ lệ lấp đầy */
    const totalSeats = await sequelize.query(
      `
      SELECT COUNT(*) total FROM ShowtimeSeats
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    const fillRate = ((totalTickets / totalSeats[0].total) * 100).toFixed(1);

    /* Biểu đồ */
    const revenueChart = await sequelize.query(
      `
      SELECT DATE(createdAt) as date, SUM(totalAmount) total
      FROM Orders
      WHERE status='paid'
      GROUP BY DATE(createdAt)
      ORDER BY date
      LIMIT 7
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    /* Top phim */
    const topMovies = await sequelize.query(
      `
      SELECT m.title, SUM(o.totalAmount) revenue
      FROM Orders o
      JOIN ShowTimes s ON o.showtimeId = s.id
      JOIN Movies m ON s.movieId = m.id
      WHERE o.status='paid'
      GROUP BY m.id
      ORDER BY revenue DESC
      LIMIT 5
    `,
      { type: sequelize.QueryTypes.SELECT },
    );

    res.json({
      revenueToday,
      totalTickets,
      fillRate,
      revenueChart,
      topMovies,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(orders);
};

exports.refundOrder = async (req, res) => {
  const { orderId } = req.params;

  await Order.update({ status: "refunded" }, { where: { id: orderId } });

  res.json({ message: "Hoàn tiền thành công" });
};
