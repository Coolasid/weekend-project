const Sequelize =  require("sequelize");

const db = new Sequelize('assignment1', 'postgres', 'Siddesh9575', {
  dialect: 'postgres',
  host: 'localhost',
});


db.authenticate()
  .then(() => {
    console.log('Database connected...');
  })
  .catch((err) => {
    console.log('Error: ' + err);
  });

module.exports = db;