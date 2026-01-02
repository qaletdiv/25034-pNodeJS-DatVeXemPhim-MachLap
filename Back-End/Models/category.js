"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    // Category inherits from model
    static associate(models) {
      // Define the relationship between tables in SQL.
      Category.belongsToMany(models.Movie, {
        through: models.MovieCategory, // intermediate table
        foreignKey: "categoryId", // Foreign language in the current table
        otherKey: "movieId", // The foreign department of the table wants to visit.
        as: "movies",
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize, // instance to connect Database
      modelName: "Category", // logic variable
      tableName: "Categories", // Name table in Database
      timestamps: true, // automatically insert the automatically generated columns
    }
  );

  return Category;
};
