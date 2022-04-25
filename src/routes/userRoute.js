const express = require('express');
const {
  registerUser,
  findAllUsers,
  deleteUser,
  verifyUser,
  loginUser,
  updatingUser,
  forgetPassword,
  updatePassword,
  resetPassword,
} = require('../controllers/userController');

const userRouter = express.Router();

const authorization = require('../middlewares/authorization');

//registering user
userRouter.route('/addUser').post(async (req, res) => {
  try {
    const user = await registerUser(req.body);
    if(!user) return res.send({message: "user is not created"})
    return res.send({ user: user.res, token: user.token }).status(201);
  } catch (error) {
    throw error;
  }
});

userRouter.route('/getAllUsers').get(authorization, async (req, res) => {
  try {
    const users = await findAllUsers();
    if(!users) return res.send({message: "users is not fetched"})
    return res.status(200).send(users.res);
  } catch (error) {
    throw error;
  }
});

userRouter.route('/deleteUser').delete(authorization, async (req, res) => {
  try {
    const id = req.user.id;
    const deletedUser = await deleteUser(id);
    if(!deleteUser) return res.send({message: "user is not deleted"})
    return res.send({
      deletedUser: deletedUser.res,
      message: deletedUser.message,
    });
  } catch (error) {
    throw error;
  }
});

//verify the user
userRouter.route('/verifyUser/:token').get(async (req, res) => {
  try {
    const token = req.params.token;
    const verifiedUser = await verifyUser(token);
    if(!verifiedUser) return res.send({message: "user is not verified"})
    return res
      .status(200)
      .send({ user: verifiedUser.updatedUser, message: verifiedUser.message });
  } catch (error) {
    throw error;
  }
});

//login route
userRouter.route('/userLogin').post(async (req, res) => {
  try {
    const email = req.body.email;
    let password = req.body.password;
    const user = await loginUser(email, password);
    if(!loginUser) return res.send({message: "user is not logged In"})
    if (user.message) {
      return res.send({ message: user.message });
    } else {
      return res.status(200).send({ user: user.user, token: user.token });
    }
  } catch (error) {
    throw error;
  }
});

//updating fields
userRouter.route('/update').patch(authorization, async (req, res) => {
  try {
    let id = req.user.id;
    let newUser = req.body;
    const updatedUser = await updatingUser(id, newUser);
    if(!updatingUser) return res.send({message: "user is not updated"})
    return res
      .status(200)
      .send({ user: updatedUser.res, message: updatedUser.message });
  } catch (error) {
    throw error;
  }
});

//update password
userRouter.route('/updatePassword').post(authorization, async (req, res) => {
  try {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let userID = req.user.id;
    const result = await updatePassword(oldPassword, newPassword, userID);
    if(!result) return res.send({message: "password is not updated"})
    return res.send({ message: result.message }).status(200);
  } catch (error) {
    throw error;
  }
});

//forget password
userRouter.route('/forgetPassword').post(async (req, res) => {
  try {
    let email = req.body.email;
    const result = await forgetPassword(email);
    if(!result) return res.send({message: "email is not sent"})
    return res.send({ message: result.message });
  } catch (error) {
    throw error;
  }
});

userRouter.route('/resetPassword').patch(authorization, async (req, res) => {
  try {
    let userID = req.user.id;
    let newPassword = req.body.newPassword;
    const result = await resetPassword(userID, newPassword);
    if(!result) return res.send({message: "password is not successfully reset"})
    return res.send({ message: result.message });
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
