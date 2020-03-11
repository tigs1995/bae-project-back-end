const bcrypt = require("bcryptjs");
module.exports = function(sequelize, type) {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: type.STRING,
        field: "username",
        unique: true,
        validate: {
          isUnique: function(value, next) {
            User.findOne({
              where: { username: value }
            }).done(function(error, user) {
              if (error) {
                return next("Sorry that username is taken.");
              }
              if (user) {
                return next("Sorry that username is taken.");
              }
              next();
            });
          }
        }
      },
      password: {
        type: type.STRING,
        set(val) {
          this.setDataValue("password", bcrypt.hashSync(val, 12));
        }
      }
    },
    {
      freezeTableName: true,
      instanceMethods: {
        validPassword(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
    }
  );
  return User;
};
