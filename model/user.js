const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:4,
        maxlength:15,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        // maxlength:64,
    },
    email: {
        type: String,
        required: true,
    },
    items: [{
        property: String,
        amount: Number,
        category: String,
        description: String
    }]
})

module.exports = mongoose.model("users", user);