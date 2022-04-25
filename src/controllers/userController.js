const bcrypt = require('bcryptjs');

const { sendMail, sendPasswordResetEmail } = require('../utils/sendEmail');
const { newToken, verifyToken } = require('../utils/jwt');
const authorization = require('../middlewares/authorization');
const {
  addUser,
  deleteUserByID,
  getAllUsers,
  getUserByID,
  updateStatusOfUser,
  findByEmail,
  updateFields,
  updatePassInDB,
} = require('../dao/userDao');

const registerUser = async (data) => {
  try {
    if (
      data.email &&
      data.firstName &&
      data.lastName &&
      data.phoneNumber &&
      data.password
    ) {
      user = await addUser(data);
      if (!user) return false;
      //creating token
      let token = newToken(user);

      //sending email to verify user
      sendMail(data.email, token);

      return { res: user, token: token };
    } else {
      return { res: null, message: 'invalid details' };
    }
  } catch (error) {
    throw error;
  }
};

const findAllUsers = async () => {
  try {
    const users = await getAllUsers();
    if(!users){
      return false
    }
    return { res: users };
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    if (id) {
      const user = await deleteUserByID(id);
      if(!user) return false;
      return { res: user, message: 'user is deleted' };
    } else {
      return { res: null, message: 'user is not deleted' };
    }
  } catch (error) {
    throw error;
  }
};

const verifyUser = async (token) => {
  try {
    if (token) {
      let user = await verifyToken(token);
      if(!user) return false
      const userInDB = await getUserByID(user.user.id);
      if(!userInDB) return false
      //updating status of user
      let newUser = await updateStatusOfUser(userInDB.id);
      if(!newUser) return false
      return {
        updatedUser: newUser,
        message: 'user verification completed',
      };
    } else {
      return {
        updatedUser: null,
        message: 'Invalid Link',
      };
    }
  } catch (error) {
    throw {
      message: 'Invalid token',
    };
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await findByEmail(email);
    if(!user) return false
    if (user) {
      if (user.dataValues.isVerified) {
        let hashedPasswordInDB = user.dataValues.password;

        //checking password
        let originalPass = () => {
          return bcrypt.compareSync(password, hashedPasswordInDB);
        };

        if (originalPass()) {
          let token = newToken(user);
          return { user: user, token: token };
        } else {
          return {
            message: 'Password is incorrect',
          };
        }
      } else {
        return {
          message: 'user is not verified',
        };
      }
    } else {
      return { message: 'User not exist' };
    }
  } catch (error) {
    throw error;
  }
};

const updatingUser = async (id, newDetails) => {
  try {
    if (id && newDetails) {
      let updatedUser = await updateFields(id, newDetails);
      if(!updatedUser) return false

      return { res: updatedUser, message: 'user is updated' };
    } else {
      return { res: null, message: 'please provide valid information' };
    }
  } catch (error) {
    throw error;
  }
};

const forgetPassword = async (email) => {
  try {
    if (email) {
      let user = await findByEmail(email);
      if(!user) return false
      let token = newToken(user);

      sendPasswordResetEmail(email, token);
      return {
        message: 'password reset link send to user email',
      };
    } else {
      return { message: 'please provide valid information' };
    }
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (oldPassword, newPassword, userID) => {
  try {
    let findUser = await getUserByID(userID);
    if(!findUser) return false
    let passInDB = findUser.password;
    let isOriginalPass = () => {
      return bcrypt.compareSync(oldPassword, passInDB);
    };

    if (isOriginalPass) {
      const encryptPassword = (pass) => {
        if (pass) {
          const hash = bcrypt.hashSync(pass, 10);
          return hash;
        }
      };
      const result = await updatePassInDB(userID, encryptPassword(newPassword));
      if(!result) return false
      return { res: result, message: 'password is being updated' };
    } else {
      return { message: 'pasword is wrong' };
    }
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (userID, newPassword) => {
  try {
    let user = await getUserByID(userID);
    if(!user) return false
    if (user) {
      const encryptPassword = (pass) => {
        if (pass) {
          const hash = bcrypt.hashSync(pass, 10);
          return hash;
        }
      };

      let updatedUser = await resetPassword(
        userID,
        encryptPassword(newPassword)
      );
      return res.send({
        res: updatedUser,
        message: 'password reset successfully',
      });
    } else {
      return res.send({ message: 'link is not valid' });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  findAllUsers,
  deleteUser,
  verifyUser,
  loginUser,
  updatingUser,
  updatePassword,
  forgetPassword,
  resetPassword,
};
