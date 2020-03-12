const Sequelize = require("sequelize");
const UserModel = require("../models/user_model");
const { dbHost, dbPort } = require("../consts.json");

const connection = new Sequelize("app", "admin", "password", {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    options: {
      timeout: 50000000
    }
  }
});

const User = UserModel(connection, Sequelize);

connection.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});

module.exports = {
  User,
  connection
};
