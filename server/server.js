if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const router = require('./routes/routes.js')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
app.use('/', router);

module.exports=app;