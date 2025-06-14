const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { nom, prenom, email, password, roles } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ nom, prenom, email, password: hash });

    // Attribution des rôles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.findAll({
        where: { nom: roles },
      });
      await newUser.setRoles(foundRoles);
    } else {
      const defaultRole = await Role.findOne({ where: { nom: "user" } });
      await newUser.setRoles([defaultRole]);
    }

    res.status(201).send({ message: "Utilisateur inscrit avec succès." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: ["roles"],
    });

    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable." });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24h
    });

    const authorities = user.roles.map(role => role.nom);

    res.status(200).send({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.userId;
    await Log.create({ userId, action: "Déconnexion", dateAction: new Date() });

    res.status(200).send({ message: "Déconnecté avec succès" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

