const nodemailer = require("nodemailer");
const emailConfig = require("../config/email.config");

const transporter = nodemailer.createTransport(emailConfig);

exports.sendResetPasswordEmail = async (to, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"SecureAuth" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Réinitialisation de mot de passe",
    html: `
      <h3>Réinitialisation de votre mot de passe</h3>
      <p>Pour réinitialiser votre mot de passe, cliquez sur le lien ci-dessous :</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ce lien expirera dans 15 minutes.</p>
    `
  });
};
