// validators/auth.validator.js
const { body } = require("express-validator");

exports.forgotPasswordValidator = [
  body("email")
    .isEmail().withMessage("Email invalide")
    .normalizeEmail(),
];

exports.resetPasswordValidator = [
  body("token")
    .notEmpty().withMessage("Token requis"),

  body("newPassword")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit faire au moins 8 caractères")
    .matches(/[A-Z]/).withMessage("Inclure au moins une majuscule")
    .matches(/[a-z]/).withMessage("Inclure au moins une minuscule")
    .matches(/[0-9]/).withMessage("Inclure au moins un chiffre")
    .matches(/[\W]/).withMessage("Inclure au moins un caractère spécial"),
];
