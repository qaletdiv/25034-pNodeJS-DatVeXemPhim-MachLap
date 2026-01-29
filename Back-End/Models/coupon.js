"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      Coupon.hasMany(models.Order, {
        foreignKey: "couponId",
        as: "orders",
      });
    }
  }

  Coupon.init(
    {
      codeName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("percent", "fixed"),
        allowNull: false,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Coupon",
      tableName: "Coupons",
      timestamps: false,
    },
  );

  return Coupon;
};
