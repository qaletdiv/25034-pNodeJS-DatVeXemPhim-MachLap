"use strict"

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class User extends Model { // category kế thừa từ model
        static associate(models) { // dinh nghia quan he giua cac table trong sql
            User.hasMany(models.Ticket, {
                foreignKey: "userId", // ten khoa ngoai
                as: "tickets"
            })
        }
    }
    User.init(
        {
            google_id: {
                type: DataTypes.STRING,
                allowNull: true
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
                }
            },
            phone: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: true,
                // Google login: "0000000000"
            },
            role: {
                type: DataTypes.ENUM("user", "admin"),
                allowNull: false,
                defaultValue: "user" // role mac dinh
            },


        },
        {
            sequelize, // instance de ket noi vs Database
            modelName: "User", // ten bien logic 
            tableName: "Users", // ten table trong Database
            timestamps: true, // tự động đưa các cột sinh tự động vào 
            defaultScope: {
                attributes: { exclude: ["password"] }
            },
            scopes: {
                withPassword: {
                    attributes: {}
                }
            }
        }
    );

    return User;
}