module.exports = (sequelize, type) => {
    return sequelize.define('user', {
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