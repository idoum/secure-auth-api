const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "Trop de requêtes. Réessayez plus tard."
});

module.exports = limiter;
