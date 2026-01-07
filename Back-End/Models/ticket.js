"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

      Ticket.belongsTo(models.ShowtimeSeat, {
        foreignKey: "showtimeSeatId",
        as: "showtimeSeat",
      });
    }
  }

  Ticket.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      showtimeSeatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Ticket",
      tableName: "Tickets",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["showtimeSeatId"],
        },
      ],
    }
  );

  return Ticket;
};
