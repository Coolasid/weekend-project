const User = require('../models/user');

const addUser = async (userData) => {
  return User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
  });
};

const getAllUsers = async () => {
  return User.findAll();
};

const deleteUser = async (userID) => {
  return User.destroy({ where: { id: userID } });
};

const findOneUser = async (id) => {
  return User.findOne({ where: { id: id } });
};

const updateStatusOfUser = async (id) => {
  return User.update({ isVarified: true }, { where: { id: id } });
};

module.exports = {
  addUser,
  getAllUsers,
  deleteUser,
  findOneUser,
  updateStatusOfUser
};
