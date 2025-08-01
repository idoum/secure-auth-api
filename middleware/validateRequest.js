// middleware/validateRequest.js
const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
    });
  }
  next();
};
