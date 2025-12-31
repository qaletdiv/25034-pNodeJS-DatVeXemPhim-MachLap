"use strict"

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class Film extends Model { // Film kế thừa từ model
        static associate(models) { // dinh nghia quan he giua cac table trong sql


            Film.belongsToMany(models.Category, {
                through: models.FilmCategory, // ten bang trung gian
                foreignKey: "filmId", // khoa ngoai trong table hien tai
                otherKey: "categoryId", // khoa ngoai cua table muon tham chieu toi
                as: "categories"
            })
        }
    }
    Film.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            format: {
                type: DataTypes.STRING,
                allowNull: false
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            release_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            poster: {
                type: DataTypes.STRING,
                allowNull: false
            },
            trailer: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            sequelize, // instance de ket noi vs Database
            modelName: "Film", // ten bien logic 
            tableName: "Films", // ten table trong Database
            timestamps: true // tự động đưa các cột sinh tự động vào 
        }
    );

    return Film;
}