const Sequelize = require('sequelize');
const UserModel = require('../models/user_model');

const connection = new Sequelize('app', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

const User = UserModel(connection, Sequelize);

connect.sync({ force: true }).then(() => {
    console.log("Database & tables created!")
});

module.exports = {
    User
}
