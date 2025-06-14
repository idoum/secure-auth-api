const { verifyToken } = require("../middleware/authJwt");
const { checkRole } = require("../middleware/roleAuth");
const { logAction } = require("../middleware/logAction");
const controller = require("../controllers/user.controller");

module.exports = app => {
  const router = require("express").Router();

  // Lecture des utilisateurs (admin)
  router.get("/", verifyToken, checkRole(["admin"]), logAction("Liste utilisateurs"), controller.getAllUsers);

  // Ajouter un rôle
  router.post("/add-role", verifyToken, checkRole(["admin"]), logAction("Ajout rôle utilisateur"), controller.addRoleToUser);

  // Retirer un rôle
  router.post("/remove-role", verifyToken, checkRole(["admin"]), logAction("Suppression rôle utilisateur"), controller.removeRoleFromUser);

  // Supprimer utilisateur
  router.delete("/:id", verifyToken, checkRole(["admin"]), logAction("Suppression utilisateur"), controller.deleteUser);


  app.use("/api/users", router);
};
