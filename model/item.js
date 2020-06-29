const mongoose = require("mongoose");

const item = new mongoose.Schema({
    property: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: String,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model("items", item);