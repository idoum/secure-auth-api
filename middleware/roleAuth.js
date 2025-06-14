const db = require("../models");
const User = db.user;

const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    const user = await User.findByPk(req.userId, {
      include: ["roles"]
    });

    if (!user) return res.status(403).send({ message: "Utilisateur non trouvé." });

    const roleNames = user.roles.map(role => role.nom);
    const hasRole = requiredRoles.some(r => roleNames.includes(r));

    if (!hasRole) {
      return res.status(403).send({ message: "Accès refusé : rôle insuffisant." });
    }

    next();
  };
};

module.exports = { checkRole };
