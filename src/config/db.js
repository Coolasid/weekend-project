const Sequelize =  require("sequelize");

const sequelize = new Sequelize('assignment1', 'postgres', 'Siddesh9575', {
  dialect: 'postgres',
  host: 'localhost',
});

module.exports = sequelize;