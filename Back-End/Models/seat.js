"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    static associate(models) {
      Seat.belongsTo(models.Room, {
        foreignKey: "roomId",
        as: "room",
      });

      // Seat.belongsToMany(models.ShowTime, {
      //   through: models.ShowtimeSeat,
      //   foreignKey: "seatId",
      //   otherKey: "showtimeId",
      //   as: "showtimes",
      // });

      Seat.hasMany(models.ShowtimeSeat, {
        foreignKey: "seatId",
        as: "showtimeSeats",
      });
    }
  }
  Seat.init(
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("standard", "vip", "couple"),
        defaultValue: "standard",
      },
    },
    {
      sequelize,
      modelName: "Seat",
      tableName: "Seats",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["roomId", "seatNumber"],
        },
      ],
    }
  );

  return Seat;
};
