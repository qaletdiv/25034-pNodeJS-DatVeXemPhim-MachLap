"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ComboMeal extends Model {
    static associate(models) {
      ComboMeal.belongsToMany(models.Order, {
        through: models.OrderCombo,
        foreignKey: "comboId",
        as: "orders",
      });

      ComboMeal.hasMany(models.OrderCombo, {
        foreignKey: "comboId",
        as: "orderCombos",
      });
    }
  }

  ComboMeal.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "ComboMeal",
      tableName: "Combos",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  );

  return ComboMeal;
};
