const bodyparser = require('body-parser');
const express = require("express");
const cors = require('cors');



//Database connection

const db = require('./config/db');
db.authenticate().then(()=>{
    console.log('Database connected...');
}).catch(err =>{
    console.log("Error: "+ err);
});

const app = express(); 

module.exports = app;

app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({extended: true, limit: '50mb'}));
app.use(cors("*"));


// add user 

const userCont = require("./controllers/userCont")
app.use("/", userCont)



db.sync().then(()=>{
    app.listen(2345, ()=>{
        console.log("server started on port 2345");
    })
}).catch(err => console.log("error: " + err))


