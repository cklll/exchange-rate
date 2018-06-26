const express = require('express');
const router = require('./routes/routes.js')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const connectionString = "mongodb+srv://dev-user:rqZajLm8e3TVQ5t1@cluster0-4amac.mongodb.net/dev_rates_history";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
mongoose.connect(connectionString);
app.use('/', router);

module.exports=app;