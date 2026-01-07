"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShowtimeSeat extends Model {
    static associate(models) {
      ShowtimeSeat.belongsTo(models.ShowTime, {
        foreignKey: "showtimeId",
      });

      ShowtimeSeat.belongsTo(models.Seat, {
        foreignKey: "seatId",
      });

      ShowtimeSeat.hasOne(models.Ticket, {
        foreignKey: "showtimeSeatId",
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
