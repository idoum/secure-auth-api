const { verifyToken } = require("../middleware/authJwt");
const { checkRole } = require("../middleware/roleAuth");
const controller = require("../controllers/role.controller");

module.exports = app => {
  const router = require("express").Router();

  // Liste des rôles (accessible à tous les utilisateurs connectés)
  router.get("/", verifyToken, controller.getAllRoles);

  app.use("/api/roles", router);
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).send(roles);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};