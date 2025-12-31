"use strict"

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class FilmCategory extends Model { //  kế thừa từ model

    }
    FilmCategory.init(
        {


        },
        {
            sequelize, // instance de ket noi vs Database
            modelName: "FilmCategory", // ten bien logic 
            tableName: "FilmCategories", // ten table trong Database
            timestamps: true // tự động đưa các cột sinh tự động vào 
        }
    );

    return FilmCategory;
}