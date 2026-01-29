"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const db = {};

const sequelize = new Sequelize(config);

// defind models

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Ticket = require("./ticket")(sequelize, Sequelize.DataTypes);
db.Movie = require("./movie")(sequelize, Sequelize.DataTypes);
db.MovieCategory = require("./movieCategory")(sequelize, Sequelize.DataTypes);
db.Category = require("./category")(sequelize, Sequelize.DataTypes);
db.ShowTime = require("./showTime")(sequelize, Sequelize.DataTypes);
db.Room = require("./room")(sequelize, Sequelize.DataTypes);
db.MovieTheater = require("./movieTheater")(sequelize, Sequelize.DataTypes);
db.Seat = require("./seat")(sequelize, Sequelize.DataTypes);
db.Order = require("./order")(sequelize, Sequelize.DataTypes);
db.Payment = require("./payment")(sequelize, Sequelize.DataTypes);
db.ShowtimeSeat = require("./showtimeSeat")(sequelize, Sequelize.DataTypes);
db.ComboMeal = require("./comboMeal")(sequelize, Sequelize.DataTypes);
db.OrderCombo = require("./orderCombo")(sequelize, Sequelize.DataTypes);
db.Coupon = require("./coupon")(sequelize, Sequelize.DataTypes);

// Check the models to see it have associate ?
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
