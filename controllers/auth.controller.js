const db = require("../models");
const User = db.user;
const Role = db.role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../utils/emailService");

exports.signup = async (req, res, next) => {
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
    next(err); // passe l'erreur au middleware
  }
};

exports.signin = async (req, res, next) => {
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

    const authorities = user.roles.map((role) => role.nom);

    res.status(200).send({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    await Log.create({ userId, action: "Déconnexion", dateAction: new Date() });

    res.status(200).send({ message: "Déconnecté avec succès" });
  } catch (err) {
    next(err); // passe l'erreur au middleware
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await db.user.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(token).digest("hex");

    // Stocker dans une table dédiée ou champs dans user
    user.resetToken = hash;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await sendResetPasswordEmail(user.email, token);

    res
      .status(200)
      .json({ message: "E-mail envoyé avec le lien de réinitialisation." });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const hash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.user.findOne({
      where: {
        resetToken: hash,
        resetTokenExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    next(err);
  }
};
