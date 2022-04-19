const bodyparser = require('body-parser');
const express = require('express');
const cors = require('cors');

const userRoute = require("./routes/userRoute")
const db = require('./config/db');

const app = express();

//Database connection

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors('*'));


// user Controllers
app.use('/', userRoute);

db.sync()
  .then(() => {
    app.listen(2345, () => {
      console.log('server started on port 2345');
    });
  })
  .catch((err) => console.log('error: ' + err));

module.exports = app;
