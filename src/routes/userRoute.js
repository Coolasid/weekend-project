const express = require('express');
const userRouter = express.Router();
const { addUser, deleteUser } = require('../controllers/userController');

userRouter.route('/addUser').post(async (req, res) => {
  try {
    const user = await addUser(req.body);
    res.send(user).status(201);
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
      res.json({
        message: 'please provide ID',
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
