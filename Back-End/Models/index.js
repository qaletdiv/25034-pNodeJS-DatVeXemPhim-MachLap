"use strict"

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const db = {};

const sequelize = new Sequelize(config);

// cho khai bao cac models

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Ticket = require("./ticket")(sequelize, Sequelize.DataTypes);
db.Film = require("./film")(sequelize, Sequelize.DataTypes);
db.FilmCategory = require("./filmCategory")(sequelize, Sequelize.DataTypes);
db.Category = require("./category")(sequelize, Sequelize.DataTypes);





// kiem tra qua cac model xem co assciate khong 
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;