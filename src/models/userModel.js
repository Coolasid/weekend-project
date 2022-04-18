const Sequelize = require('sequelize');
const db = require("../config/db")
const bcrypt = require("bcryptjs")

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


User.beforeCreate((user) => {
  return bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
    })
    .catch(() => {
      throw new Error();
    });
});
// User.pre("save", (next) =>{

//   // either we are creating a user or we are updataing a user
//   if(!this.isModified("password")) return next();

//   this.password = bcrypt.hashSync(this.password, 8)
//   return next();
// })

module.exports = User;
