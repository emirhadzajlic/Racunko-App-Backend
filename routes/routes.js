const routes = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../controller/user");
const Auth = require("../authorization/auth");
const userModel = require("../model/user");
const Token = require("../model/emailToken");
const emailToken = require("../controller/emailToken")
const Item = require("../controller/item");

routes.post("/register", (req, res) => {
  userModel.findOne({ email: req.body.email }, async (err, user) => {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    user.save(function () {
      var token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });

      token.save(function () {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "emirhadzajlic001@gmail.com",
            pass: process.env.PASSWORD,
          },
        });
        var mailOptions = {
          from: "emirhadzajlic001@gmail.com",
          to: user.email,
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/confirmation/" +
            token.token +
            ".\n",
        };
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res
            .status(200)
            .json({
              msg: "A verification email has been sent to " + user.email + ".",
              emailToken: token.token,
            });
        });
      });
    });
  });
});

routes.post("/login", Auth.createToken);

routes.delete("/delete", (req, res) => {
  Item.deleteItem(req.body.username, req.body.id)
    .then((e) => {
      res.send(e);
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

routes.post("/add", async (req, res) => {
  try{
    const newItem = await Item.addItem(req.body.item);
    const user = await User.findUserByUsername(req.body.username)
    var newItems = user.items;
    newItems.push(newItem._id);
    await Item.updateItems(req.body.username, newItems)
    res.send(newItem);
  } catch(e) {
    res.send(e)
  }
});

routes.post('/items', async (req, res) => {
  let foundUser = await userModel.find({username:req.body.username})
  .populate().exec();
  res.send(foundUser[0].items)
})

routes.post("/diagram", async (req, res) => {
  let foundUser = await userModel.find({ username: req.body.username }).populate('items').exec();

  let dataForDiagram = [];
  let totalAmountPrihod = 0;
  let totalAmountRashod = 0;

  for (let i = 0; i < foundUser[0].items.length; i++) {
    if (foundUser[0].items[i].property === "prihod") {
      totalAmountPrihod += foundUser[0].items[i].amount;
    } else {
      totalAmountRashod += foundUser[0].items[i].amount;
    }
  }
  for (let i = 0; i < foundUser[0].items.length; i++) {
    if (foundUser[0].items[i].property === "prihod") {
      dataForDiagram.push({
        property: "prihod",
        category: foundUser[0].items[i].category,
        percentage: foundUser[0].items[i].amount / totalAmountPrihod,
      });
    } else {
      dataForDiagram.push({
        property: "rashod",
        category: foundUser[0].items[i].category,
        percentage: foundUser[0].items[i].amount / totalAmountRashod,
      });
    }
  }
  res.send(dataForDiagram);
});

routes.post("/filter", async (req, res) => {
  let x = await userModel.findOne({ username: req.body.username })
  .populate("items").exec();

  let arr = [];

  x.items.forEach((e) => {
    let k = e.createdAt.toString();
    if (
      k.substring(4, 7) === req.body.month &&
      k.substring(11, 15) === req.body.year
    ) {
      arr.push(e);
    }
  });
  res.send(arr);
});

routes.post("/confirmation", emailToken.confirmationPost);

module.exports = routes;
