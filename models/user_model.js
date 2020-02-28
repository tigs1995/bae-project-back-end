const bcrypt = require("bcrypt");
module.exports = function(sequelize, type) {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: type.STRING,
        field: "username"
      },
      password: DataTypes.STRING
    },
    {
      freezeTableName: true,
      instanceMethods: {
        generateHash(password) {
          return bcrypt.hash(password, bcrypt.genSaltSync(8));
        },
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        }
      }
    }
  );
  return User;
};
