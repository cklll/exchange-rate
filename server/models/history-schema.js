const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    dateNumber: {
        type: Number, /* YYYYMMDD */
        unique: true,
        required: true,
        index: true,
    },
    dateString: {
        type: String, /* YYYY-MM-DD */
    },
    rateToUSD: Number
});

module.exports = historySchema;