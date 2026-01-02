"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Ticket.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("booked", "paid", "cancelled"),
        defaultValue: "booked",
      },
    },
    {
      sequelize,
      modelName: "Ticket",
      tableName: "Tickets",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["showtimeId", "seatId"], // Prevent duplicate seat placement
        },
      ],
    }
  );

  return Ticket;
};
