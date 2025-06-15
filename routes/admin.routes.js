const { verifyToken } = require("../middleware/authJwt");
const { checkRole } = require("../middleware/roleAuth");
const adminController = require("../controllers/admin.controller");

module.exports = app => {
  const router = require("express").Router();

  router.get("/logs", verifyToken, checkRole(["admin"]), adminController.getLogs);

  app.use("/api/admin", router);
};
