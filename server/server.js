const express = require('express');
const router = require('./routes/routes.js')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
  }

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`);
app.use('/', router);

module.exports=app;