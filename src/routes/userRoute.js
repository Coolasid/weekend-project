const express = require('express');
const addUser = require('../controllers/userCont');
const router = express.Router();

router.post("/addUser", async (req, res) => {
    try {
        const res = await addUser(req.body);
        res.send(res);
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;
