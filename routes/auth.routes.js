const { checkDuplicateEmail } = require("../middleware/verifySignUp");
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
  const router = require("express").Router();

  router.post("/signup", checkDuplicateEmail, controller.signup);
  router.post("/signin", controller.signin);
  router.post("/forgot-password", controller.forgotPassword);
  router.post("/reset-password", controller.resetPassword);

  app.use("/api/auth", router);
};
