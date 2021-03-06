const User = require('../models/user');

const addUser = async (userData) => {
  return User.create({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber,
  });
};

const getAllUsers = async () => {
  return User.findAll();
};

const deleteUserByID = async (userID) => {
  return User.destroy({ where: { id: userID } });
};

const getUserByID = async (id) => {
  return User.findOne({ where: { id: id } });
};

const updateStatusOfUser = async (id) => {
  return User.update({ isVerified: true }, { where: { id: id } });
};

const findByEmail = async (email) => {
  return User.findOne({ where: { email: email } });
};

const updateFields = async (id, updatedValue) => {
  return User.update(updatedValue, { where: { id: id } });
};

const updatePassInDB = async (id, newPassword) => {
  return User.update({ password: newPassword }, { where: { id: id } });
};

module.exports = {
  updatePassInDB,
  addUser,
  getAllUsers,
  deleteUserByID,
  getUserByID,
  updateStatusOfUser,
  findByEmail,
  updateFields,
};
