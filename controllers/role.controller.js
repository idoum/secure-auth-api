const db = require("../models");
const Role = db.role;

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).send(roles);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
