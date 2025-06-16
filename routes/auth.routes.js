const { checkDuplicateEmail } = require("../middleware/verifySignUp");
const { verifyToken } = require("../middleware/authJwt");
const controller = require("../controllers/auth.controller");
const {  forgotPasswordValidator,   resetPasswordValidator, } = require("../validators/auth.validator");
const validateRequest = require("../middleware/validateRequest");

module.exports = (app) => {
  const router = require("express").Router();

  router.post("/signup", checkDuplicateEmail, controller.signup);
  router.post("/signin", controller.signin);
  router.post("/forgot-password", forgotPasswordValidator, validateRequest, controller.forgotPassword);
  router.post("/reset-password", resetPasswordValidator, validateRequest, controller.resetPassword);
  router.post("/logout", verifyToken, controller.logout);

  app.use("/api/auth", router);
};
