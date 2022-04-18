const Sequelize =  require("sequelize");

const db = new Sequelize('assignment1', 'postgres', 'Siddesh9575', {
  dialect: 'postgres',
  host: 'localhost',
});

module.exports = db;