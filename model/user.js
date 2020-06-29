const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 15,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  items: [
    {
      type: mongoose.Types.ObjectId,
      ref: "items"
    },
  ],
});

module.exports = mongoose.model("users", user);
