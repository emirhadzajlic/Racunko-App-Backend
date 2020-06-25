const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const User = require("../model/user");

async function createToken(req, res) {
  try {
    const user = {
        username: req.body.username,
        password: req.body.password
    };
  
    const found = await User.findOne({
      username: user.username  
    })

    const isMatch = await bcrypt.compare(req.body.password, found.password)

    if (isMatch) {
      jwt.sign(
        { found },
        process.env.SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if(err) console.log(err)
          res.json({
            token:token,
            items:found.items
          });
        }
      );
    } else {
      res.json({ error: "Incorrect password!" });
    }
  } catch (err) {
    console.log(err)
    res.status(403).json({ error: "User does not exist!" });
  }
}

function verifyToken(req, res, next) {
  if(req.url == "/login" || req.url == "/register"){
      next();
  } else {
    const bh = req.headers["authorization"];
    if (typeof bh !== "undefined") {
      req.token = bh.split(" ")[1];
      jwt.verify(req.token, process.env.SECRET, (err, auth) => {
        if (err) {
          res.status(403).json({ error: "Authentication failed!" });
          return;
        }
        next();
      });
    } else {
      res.sendStatus(403);
    }
  }
}

module.exports = {
  createToken,
  verifyToken,
};