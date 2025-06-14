const db = require("../models");
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    return res.status(400).send({ message: "Email déjà utilisé." });
  }
  next();
};

module.exports = { checkDuplicateEmail };
