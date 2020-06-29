const Token = require("../model/emailToken");

function confirmationPost(req, res, next) {
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token)
      return res
        .status(400)
        .send({
          type: "not-verified",
          msg:
            "We were unable to find a valid token. Your token my have expired.",
        });

    User.findOne({ _id: token._userId, email: req.body.email }, function (
      err,
      user
    ) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified)
        return res
          .status(400)
          .send({
            type: "already-verified",
            msg: "This user has already been verified.",
          });

      user.isVerified = true;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  });
}

module.exports = {
  confirmationPost,
};