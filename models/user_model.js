module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        username: {
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