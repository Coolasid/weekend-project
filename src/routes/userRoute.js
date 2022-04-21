const express = require('express');
const bcrypt = require('bcryptjs');
const userRouter = express.Router();
const {
  addUser,
  deleteUser,
  getAllUsers,
  findOneUser,
  updateStatusOfUser,
  findByEmail,
  updateFields,
} = require('../controllers/userController');
const sendMail = require('../utils/sendEmail');
const { newToken, verifyToken } = require('../utils/jwt');

userRouter.route('/addUser').post(async (req, res) => {
  try {
    const user = await addUser(req.body);

    //creating token
    var token = newToken(user);

    //sending email to verify user
    sendMail(req.body.email, token);

    res.status(201).send({ user, token });
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

//verify the user
userRouter.route('/verifyUser/:token').get(async (req, res) => {
  const tokenGotfromAPI = req.params.token;

  try {
    if (tokenGotfromAPI) {
      var user = await verifyToken(tokenGotfromAPI);
      const userInDB = await findOneUser(user.user.id);

      //updating status of user
      await updateStatusOfUser(userInDB.id);

      return res.send({ message: 'user verification completed' });
    }else{
      res.send({
        message: "Invalid Link"
      })
    }
  } catch (error) {
    res.send({
      message: 'Invalid token',
    });
  }
});

//login route
userRouter.route('/userLogin').post(async (req, res) => {
  const email = req.body.email;

  const user = await findByEmail(email);

  // console.log(user.dataValues.id);

  if (user) {
    if (user.dataValues.isVerified) {
      let passwordFromAPI = req.body.password;
      let hashedPasswordInDB = user.dataValues.password;

      //checking password
      let originalPass = () => {
        return bcrypt.compareSync(passwordFromAPI, hashedPasswordInDB);
      };

      if (originalPass()) {
        return res.send(user).status(200);
      } else {
        return res.send({
          message: 'Password is incorrect',
        });
      }
    } else {
      return res.send({
        message: 'user is not verified',
      });
    }
  } else {
    res.status(401).send({ message: 'User not exist' });
  }
});

//updating fields
userRouter.route('/update').patch(async (req, res) => {
  let updated;
});

module.exports = userRouter;
