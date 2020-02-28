module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        userId: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userName: {
            type: type.STRING,
            field: 'username',
            allowNull: false
        },
        password: {
            type: type.STRING,
            field: 'password',
            allowNull: false,
        }

    })
};