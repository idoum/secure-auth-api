const db = require("./models");
const Role = db.role;

async function initializeRoles() {
  try {
    await db.sequelize.sync({ alter: true }); // ou { force: true } pour dev (attention : supprime les données)

    const roles = ["admin", "moderator", "user"];

    for (const roleName of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { nom: roleName },
        defaults: {
          description: `Rôle ${roleName}`,
        },
      });

      if (created) {
        console.log(`✅ Rôle créé : ${roleName}`);
      } else {
        console.log(`ℹ️ Rôle déjà existant : ${roleName}`);
      }
    }

    console.log("🎉 Initialisation des rôles terminée.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation des rôles :", error);
    process.exit(1);
  }
}

initializeRoles();
