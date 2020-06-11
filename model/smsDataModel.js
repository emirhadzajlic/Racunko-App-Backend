
const mongoose = require('mongoose');

const smsData = new mongoose.Schema({
    expend: Number,
    category: String,
    date: Date
})

module.exports = mongoose.model("sms-data", smsData);