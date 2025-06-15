const db = require("../models");
const Role = db.role;

exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    res.status(200).send(roles);
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};
