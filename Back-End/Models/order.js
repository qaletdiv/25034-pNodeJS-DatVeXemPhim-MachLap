"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Order.belongsTo(models.ShowTime, {
        foreignKey: "showtimeId",
        as: "showtime",
      });

      Order.hasMany(models.Ticket, {
        foreignKey: "orderId",
        as: "tickets",
      });

      Order.hasOne(models.Payment, {
        foreignKey: "orderId",
        as: "payment",
      });
    }
  }

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "paid", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["status"],
        },
      ],
    }
  );

  return Order;
};
