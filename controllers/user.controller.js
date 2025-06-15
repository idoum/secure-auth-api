const { Op } = require("sequelize");
const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
      include: ["roles"],
    });

    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé." });
    }

    res.status(200).send(user);
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user)
      return res.status(404).send({ message: "Utilisateur non trouvé." });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res
        .status(400)
        .send({ message: "Ancien mot de passe incorrect." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).send({ message: "Mot de passe mis à jour." });
  } catch (err) {
     next(err); // passe l'erreur au middleware
  }
};
// Lire tous les utilisateurs avec leurs rôles
exports.getAllUsers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const sort = req.query.sort || "id";
  const order = req.query.order === "desc" ? "DESC" : "ASC";

  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${search}%` } },
          { prenom: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
      include: ["roles"],
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [[sort, order]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).send({
      totalItems: count,
      totalPages,
      currentPage: page,
      users: rows,
    });
  } catch (err) {
     next(err); // passe l'erreur au middleware
  }
};

// Ajouter un rôle à un utilisateur
exports.addRoleToUser = async (req, res, next) => {
  const { userId, roleId } = req.body;
  try {
    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res
        .status(404)
        .send({ message: "Utilisateur ou rôle non trouvé" });
    }

    await user.addRole(role);
    res.status(200).send({ message: "Rôle ajouté à l'utilisateur." });
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};

// Supprimer un rôle d'un utilisateur
exports.removeRoleFromUser = async (req, res, next) => {
  const { userId, roleId } = req.body;
  try {
    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res
        .status(404)
        .send({ message: "Utilisateur ou rôle non trouvé" });
    }

    await user.removeRole(role);
    res.status(200).send({ message: "Rôle retiré de l'utilisateur." });
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const result = await User.destroy({ where: { id: userId } });
    if (result === 0) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }
    res.status(200).send({ message: "Utilisateur supprimé." });
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};
