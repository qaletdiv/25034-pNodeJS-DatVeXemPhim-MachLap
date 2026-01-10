"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShowtimeSeat extends Model {
    static associate(models) {
      ShowtimeSeat.belongsTo(models.ShowTime, {
        foreignKey: "showtimeId",
        as: "showtime",
      });

      ShowtimeSeat.belongsTo(models.Seat, {
        foreignKey: "seatId",
        as: "seat",
      });

      ShowtimeSeat.hasOne(models.Ticket, {
        foreignKey: "showtimeSeatId",
        as: "ticket",
      });
    }
  }

  ShowtimeSeat.init(
    {
      showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("available", "reserved", "booked"),
        defaultValue: "available",
      },
      reservedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reservedBy: {
        type: DataTypes.INTEGER, // userId
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ShowtimeSeat",
      tableName: "ShowtimeSeats",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["showtimeId", "seatId"],
        },
      ],
    }
  );

  return ShowtimeSeat;
};
