"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ShowTime extends Model {
    static associate(models) {
      ShowTime.belongsTo(models.Movie, {
        foreignKey: "movieId",
        as: "movie",
      });

      ShowTime.belongsTo(models.Room, {
        foreignKey: "roomId",
        as: "room",
      });
    }
  }
  ShowTime.init(
    {
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ShowTime",
      tableName: "Showtimes",
      timestamps: false,
    }
  );

  return ShowTime;
};
