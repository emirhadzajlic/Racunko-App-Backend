const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const Auth = require("./authorization/auth");
const dburl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/RacunkoApp";
const routes = require("./routes/routes");
var cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  Auth.verifyToken(req, res, next);
});

app.use("/", routes);

app.listen(port, () => {
  console.log("listen on port " + port);
  mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
});
