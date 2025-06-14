const db = require("../models");
const bcrypt = require("bcryptjs");

module.exports = async function init() {
  try {
    const roleCount = await db.role.count();
    if (roleCount === 0) {
      await db.role.bulkCreate([
        { name: "admin" },
        { name: "user" }
      ]);
      console.log("✅ Rôles créés.");
    }

    const adminExists = await db.user.findOne({ where: { email: "admin@example.com" } });
    if (!adminExists) {
      const admin = await db.user.create({
        nom: "Admin",
        prenom: "Principal",
        email: "admin@example.com",
        password: bcrypt.hashSync("Admin@123", 10)
      });

      const adminRole = await db.role.findOne({ where: { name: "admin" } });
      await admin.addRole(adminRole);

      console.log("✅ Utilisateur admin par défaut créé.");
    }
  } catch (err) {
    console.error("Erreur dans init():", err);
  }
};
// This function initializes the database with default roles and an admin user if they do not exist.
// It checks if roles are present, and if not, creates them.