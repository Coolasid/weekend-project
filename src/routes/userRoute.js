const express = require('express');
const userRouter = express.Router();
const {
  addUser,
  deleteUser,
  getAllUsers,
  findOneUser,
  updateStatusOfUser
} = require('../controllers/userController');
const sendMail = require('../utils/sendEmail');
const {newToken, verifyToken} = require('../utils/jwt');



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
userRouter.route('/verifyUser/:token').get( async(req, res)=>{

  const tokenGotfromAPI = req.params.token

  if(tokenGotfromAPI){
    try {
      var user = await verifyToken(tokenGotfromAPI);
      const userInDB = await findOneUser(user.user.id);

      // console.log(user);
      // console.log("-------------------------------");
      // console.log(userInDB);
      
      //updating status of user
     await updateStatusOfUser(userInDB.id);

     return res.send({ message: 'user verification completed' });

    } catch (error) {
      res.send({
        message: "Invalid token"
      })
    }
  }else{
    res.send({
      message: "invalid link"
    })
  }



});

module.exports = userRouter;
