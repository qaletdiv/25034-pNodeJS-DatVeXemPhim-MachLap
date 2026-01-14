"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieTheater extends Model {
    static associate(models) {
      MovieTheater.hasMany(models.Room, {
        foreignKey: "theaterId",
        as: "rooms",
      });
    }
  }
  MovieTheater.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MovieTheater",
      tableName: "Movietheaters",
      timestamps: true,
    }
  );

  return MovieTheater;
};
