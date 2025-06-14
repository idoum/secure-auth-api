module.exports = (err, req, res, next) => {
  console.error("❌ Erreur:", err);
  res.status(err.status || 500).json({
    message: err.message || "Une erreur serveur s'est produite.",
  });
};
// This middleware should be used after all other routes and middlewares