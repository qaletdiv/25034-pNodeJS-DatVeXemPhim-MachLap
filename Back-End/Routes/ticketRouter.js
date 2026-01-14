const express = require("express");
const router = express.Router();

const ticketController = require("../Controllers/ticketController");
const authenticateToken = require("../Middlewares/authenticateToken");
const { Ticket } = require("../Models");

router.get("/", authenticateToken, ticketController.getMyTickets);

module.exports = router;
