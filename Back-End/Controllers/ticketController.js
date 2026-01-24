// Controllers/ticketController.js
const { Op } = require("sequelize");
const {
  MovieTheater,
  Ticket,
  Order,
  ShowtimeSeat,
  ShowTime,
  Movie,
  Room,
  Seat,
  OrderCombo,
  Combo,
} = require("../Models");

exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: { userId },
          include: [
            {
              model: ShowTime,
              as: "showtime",
              include: [
                { model: Movie, as: "movie" },
                {
                  model: Room,
                  as: "room",
                  include: [{ model: MovieTheater, as: "movietheater" }],
                },
              ],
            },
            // LẤY COMBO
            {
              model: OrderCombo,
              as: "orderCombos",
              include: [
                {
                  model: Combo,
                  as: "combo",
                },
              ],
            },
          ],
        },
        {
          model: ShowtimeSeat,
          as: "showtimeSeat",
          include: [{ model: Seat, as: "seat" }],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
};
