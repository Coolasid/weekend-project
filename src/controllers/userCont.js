const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

router.post("/addUser", async(req, res) =>{
  try {
    const reqUser = req.body;
    const user = await User.create({firstName: reqUser.firstName, lastName: reqUser.lastName, email: reqUser.email, password: reqUser.password  })
    res.send(user)
  } catch (error) {
    console.log("error: " , error);
  }
})

module.exports = router;