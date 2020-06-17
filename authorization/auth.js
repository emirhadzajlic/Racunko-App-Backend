const jwt = require("jsonwebtoken");

const User = require("../model/user");

async function createToken(req, res) {
  try {
    const user = {
        username: req.body.username,
        password: req.body.password
    };

    const found = await User.findOne({
      username: user.username,
      password: user.password,  
    });

    if (found) {
      jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          res.json({ token });
        }
      );
    } else {
      res.json({ error: "incorrect username or password" });
    }
  } catch (err) {
    res.status(403).json({ error: "Auth failed!" });
  }
}

function verifyToken(req, res, next) {
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

module.exports = {
  createToken,
  verifyToken,
};