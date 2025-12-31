"use strict"

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        static associate(models) { // dinh nghia quan he giua cac table trong sql
            Ticket.belongsTo(models.User, {
                foreignKey: "userId", // ten khoa ngoai
                as: "user",
            });

        }
    }
    Ticket.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            showtimeId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            seatId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.ENUM('booked', 'paid', 'cancelled'),
                defaultValue: 'booked'
            }

        },
        {
            sequelize, // instance de ket noi vs Database
            modelName: "Ticket", // ten bien logic 
            tableName: "Tickets", // ten table trong Database
            timestamps: true,// tự động đưa các cột sinh tự động vào 
            indexes: [
                {
                    unique: true,
                    fields: ['showtimeId', 'seatId'] // chống đặt trùng ghế
                }
            ]
        }
    );

    return Ticket;
}