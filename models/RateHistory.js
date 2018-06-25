const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  date: {
    type: Date,
    unique: true,
    required: true,
    index:true,
  },
  rateToUSD: Number
});

module.exports = historySchema;