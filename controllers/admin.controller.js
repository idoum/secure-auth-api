const db = require("../models");
const Log = db.log;
const User = db.user;

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await Log.findAll({
      include: [{ model: User, attributes: ["id", "nom", "prenom", "email"] }],
      order: [["dateAction", "DESC"]],
      limit: 100,
    });

    res.status(200).send(logs);
  } catch (err) {
    next(err); // passe au middleware global errorHandler
  }
};
