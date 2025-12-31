"use strict"

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class Category extends Model { // category kế thừa từ model
        static associate(models) { // dinh nghia quan he giua cac table trong sql
            Category.belongsToMany(models.Film, {
                through: models.FilmCategory, // ten bang trung gian
                foreignKey: "categoryId", // khoa ngoai trong table hien tai
                otherKey: "filmId", // khoa ngoai cua table muon tham chieu toi
                as: "films"
            })
        }
    }
    Category.init(
        {
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
        },
        {
            sequelize, // instance de ket noi vs Database
            modelName: "Category", // ten bien logic 
            tableName: "Categories", // ten table trong Database
            timestamps: true // tự động đưa các cột sinh tự động vào 
        }
    );

    return Category;
}