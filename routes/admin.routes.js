const { verifyToken } = require("../middleware/authJwt");
const { checkRole } = require("../middleware/roleAuth");

module.exports = app => {
  const router = require("express").Router();
  const db = require("../models");
  const Log = db.log;
  const User = db.user;

  // Liste des logs (admin uniquement)
  router.get("/logs", verifyToken, checkRole(["admin"]), async (req, res) => {
    try {
      const logs = await Log.findAll({
        include: [{ model: User, attributes: ["id", "nom", "prenom", "email"] }],
        order: [["dateAction", "DESC"]],
        limit: 100,
      });

      res.status(200).send(logs);
    } catch (err) {
      res.status(500).send({ message: "Erreur lors de la récupération des logs." });
    }
  });

  app.use("/api/admin", router);
};
