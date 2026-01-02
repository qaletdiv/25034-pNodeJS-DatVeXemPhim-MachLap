"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsTo(models.MovieTheater, {
        foreignKey: "theaterId",
        as: "movietheater",
      });

      Room.hasMany(models.ShowTime, {
        foreignKey: "roomId",
        as: "showtimes",
      });
    }
  }
  Room.init(
    {
      theaterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Room",
      tableName: "Rooms",
      timestamps: false,
    }
  );

  return Room;
};
