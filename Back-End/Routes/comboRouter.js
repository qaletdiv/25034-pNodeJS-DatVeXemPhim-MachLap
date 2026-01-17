const express = require("express");
const router = express.Router();

const comboController = require("../Controllers/comboController");
const authenticateToken = require("../Middlewares/authenticateToken");

router.get("/", comboController.getCombo);

module.exports = router;
