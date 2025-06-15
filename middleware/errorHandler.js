// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("❌ Erreur :", err);

  const statusCode = err.status || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
