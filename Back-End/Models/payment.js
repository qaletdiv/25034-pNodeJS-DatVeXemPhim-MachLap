"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }

  Payment.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM("vnpay", "momo", "paypal", "cash"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      transactionCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
      updatedAt: false, // DB không có updatedAt
      indexes: [
        {
          fields: ["orderId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["method"],
        },
      ],
    }
  );

  return Payment;
};
