const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require("body-parser");
require("dotenv").config();

const routes = require('./routes/routes');

const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(port, () => {
    console.log("listen on port " + port);
    mongoose.connect("mongodb://127.0.0.1:27017/RacunkoApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  });