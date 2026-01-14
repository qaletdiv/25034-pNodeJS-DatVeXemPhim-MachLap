"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: "userId",
        as: "orders",
      });

      User.hasMany(models.ShowtimeSeat, {
        foreignKey: "reservedBy",
        as: "showtimeseats",
      });
    }
  }
  User.init(
    {
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      facebook_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // sequelize validate
        },
      },
      phone: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  return User;
};
