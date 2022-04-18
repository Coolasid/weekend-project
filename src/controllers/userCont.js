const User = require('./models/userModel');

const addUser = async (userData) => {
  return User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    hashedPassword: userData.password,
  });
};

module.exports = addUser;

// sequelize
//   .sync()
//   .then((res) => {
//     return User.create({
//       firstName: 'siddesh',
//       lastName: 'patil',
//       email: 'sid@gmail.com',
//       hashedPassword: 'Siddesh',
//     });
//   })
//   .then((user) => {
//     console.log('user', user);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
