const { verifyToken } = require("../middleware/authJwt");
const controller = require("../controllers/role.controller");

module.exports = app => {
  const router = require("express").Router();

  // Route : accessible à tout utilisateur connecté
  router.get("/", verifyToken, controller.getAllRoles);

  app.use("/api/roles", router);
};
