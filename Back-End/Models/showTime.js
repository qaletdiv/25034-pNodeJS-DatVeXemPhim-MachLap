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
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
