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
  resetPassword,
} = require('../controllers/userController');
const { sendMail, sendPasswordResetEmail } = require('../utils/sendEmail');
const { newToken, verifyToken } = require('../utils/jwt');
const authorization = require('../middlewares/authorization');

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

userRouter.route('/deleteUser').delete(authorization, async (req, res) => {
  try {
    const id = req.user.id;
    if (id) {
      const user = await deleteUser(id);
      res.json({
        message: 'user deleted',
      });
    } else {
      return res.send({
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
      let newUser = await updateStatusOfUser(userInDB.id);

      return res.send({
        updatedUser: newUser,
        message: 'user verification completed',
      });
    } else {
      return res.send({
        message: 'Invalid Link',
      });
    }
  } catch (error) {
    throw {
      message: 'Invalid token',
    };
  }
});

//login route
userRouter.route('/userLogin').post(async (req, res) => {
  const email = req.body.email;

  try {
    const user = await findByEmail(email);
    if (user) {
      if (user.dataValues.isVerified) {
        let passwordFromAPI = req.body.password;
        let hashedPasswordInDB = user.dataValues.password;

        //checking password
        let originalPass = () => {
          return bcrypt.compareSync(passwordFromAPI, hashedPasswordInDB);
        };

        if (originalPass()) {
          let token = newToken(user);
          return res.send({ user: user, token: token }).status(200);
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
      return res.send({ message: 'User not exist' });
    }
  } catch (error) {
    throw error;
  }
});

//updating fields
userRouter.route('/update').patch(authorization, async (req, res) => {
  let id = req.user.id;
  let newUser = req.body;

  try {
    if (id && newUser) {
      let updatedUser = await updateFields(id, newUser);

      res.send(updatedUser).status(200);
    } else {
      return res.send({ message: 'please provide valid information' });
    }
  } catch (error) {
    throw error;
  }
});

//forget password
userRouter.route('/forgetPassword').post(async (req, res) => {
  let email = req.body.email;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  try {
    if (email && oldPassword && newPassword) {
      let user = await findByEmail(email);
      let passInDB = user.dataValues.password;

      let originalPass = () => {
        return bcrypt.compareSync(oldPassword, passInDB);
      };

      if (originalPass) {
        let token = newToken(user);

        let email = user.email;

        sendPasswordResetEmail(email, token);
        return res.send({ message: 'password reset link send to user email' });
      } else {
        return res.send({ message: 'old password in not correct' });
      }
    } else {
      return res.send({ message: 'please provide valid information' });
    }
  } catch (error) {
    throw error;
  }
});

userRouter.route('/resetPassword').patch(authorization, async (req, res) => {
  try {
    let userID = req.user.id;
    let user = await findOneUser(userID);
    let newPassword = req.body.newPassword;

    if (user) {

    const encryptPassword = (pass) => {
      if (pass) {
        const hash = bcrypt.hashSync(pass, 10);
        return hash;
      }
    };

      let updatedUser = await resetPassword(userID, encryptPassword(newPassword));
      return res.send(updatedUser);
    } else {
      return res.send({ message: 'link is not valid' });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
