"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderCombo extends Model {
    static associate(models) {
      OrderCombo.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });

      OrderCombo.belongsTo(models.Combo, {
        foreignKey: "comboId",
        as: "combo",
      });
    }
  }

  OrderCombo.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      comboId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderCombo",
      tableName: "OrderCombos",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["orderId", "comboId"],
        },
      ],
    }
  );

  return OrderCombo;
};
