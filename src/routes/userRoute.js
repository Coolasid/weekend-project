const express = require('express');
const userRouter = express.Router();
const {
  addUser,
  deleteUser,
  getAllUsers,
} = require('../controllers/userController');
const sendMail = require('../utils/sendEmail');

userRouter.route('/addUser').post(async (req, res) => {
  try {
    const user = await addUser(req.body);

    //sending email to verify user
    sendMail(req.body.email);

    res.status(201).send(user);
  } catch (error) {
    throw error;
  }
});

userRouter.route('/getAllUsers').get(async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    throw error;
  }
});

userRouter.route('/deleteUser/:id').delete(async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const user = await deleteUser(id);
      res.json({
        message: 'user deleted',
      });
    } else {
      return res.json({
        message: 'please provide ID',
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
