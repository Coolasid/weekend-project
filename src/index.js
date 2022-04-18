const express = require('express');
const router = require('./routes/userRoute');
const app = express();

app.use(express.json());
 
app.use('', router);
