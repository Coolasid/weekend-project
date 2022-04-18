const Sequelize = require('sequelize');
const db = require("../config/db")

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    isEmail: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    // validate: {
    //   is: /^[0-9a-f]{64}$/i,
    // }
  },
});

module.exports = User;
