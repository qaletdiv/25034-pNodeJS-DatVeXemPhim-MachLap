"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieCategory extends Model {}
  MovieCategory.init(
    {},
    {
      sequelize,
      modelName: "MovieCategory",
      tableName: "MovieCategories",
      timestamps: true,
    }
  );

  return MovieCategory;
};
