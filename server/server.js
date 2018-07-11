if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

console.log('running in ' + process.env.NODE_ENV + ' mode');
console.log('db connection string: ...' + process.env.MONGODB_CONNECTION_STRING.slice(-20));
console.log('oxr app id: ...' + process.env.OXR_APP_ID.slice(-10))

const express = require('express');
const router = require('./routes/routes.js')
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);
const server = app.listen(port, function () {
    console.log('running at port ' + port);
});

module.exports = server;