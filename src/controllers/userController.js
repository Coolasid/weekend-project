const User = require('../models/user');


const addUser = async(userData) =>{
  return User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
  });
}

const deleteUser = async (userID) =>{
  return User.destroy({ where: { id: userID } });
}

module.exports = {
  addUser,
  deleteUser
}


// router.post('/addUser', async (req, res) => {
//   try {
//     const reqUser = req.body;
//     const user = await User.create({
//       firstName: reqUser.firstName,
//       lastName: reqUser.lastName,
//       email: reqUser.email,
//       password: reqUser.password,
//     });
//     res.send(user);
//   } catch (error) {
//     console.log('error: ', error);
//   }
// });

// router.delete('/deleteUser/:id', async (req, res) => {
//   try {
//     const id = req.params.id;

//     await User.destroy({ where: { id: id } });
//     res.send('User data deleted successfully');
//   } catch (error) {
//     console.log('error: ', error);
//   }
// });

