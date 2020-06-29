const mongoose = require("mongoose");

const item = new mongoose.Schema({
    property: String,
    amount: Number,
    category: String,
    description: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model("items", item);