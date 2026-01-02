const express = require("express");
const router = express.Router();
const handleValidateErrors = require("../Middlewares/handleValidate");
const {
  registerValidationRules,
  loginValidationRules,
} = require("../Validators/authValidator");
const authController = require("../Controllers/authController");
const authenticateToken = require("../Middlewares/authenticateToken");

router.post(
  "/register",
  registerValidationRules(),
  handleValidateErrors,
  authController.register
);

router.post(
  "/login",
  loginValidationRules(),
  handleValidateErrors,
  authController.login
);

router.post("/google-login", authController.googleLogin);
router.post("/facebook-login", authController.facebookLogin);

router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
