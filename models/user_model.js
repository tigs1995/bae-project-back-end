const bcrypt = require("bcryptjs");
module.exports = function(sequelize, type) {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: type.STRING,
        field: "username"
      },
      password: {
        type:  type.STRING,
        set (val) {
          this.setDataValue('password', bcrypt.hashSync(val, 12));
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
