const db = require("../models");
const Log = db.log;

const logAction = (actionLabel) => {
  return async (req, res, next) => {
    try {
      await Log.create({
        action: actionLabel,
        ipAdresse: req.ip,
        userAgent: req.headers['user-agent'],
        userId: req.userId || null,
      });
    } catch (err) {
      console.error("Erreur journalisation action:", err);
    }

    next();
  };
};

module.exports = { logAction };
