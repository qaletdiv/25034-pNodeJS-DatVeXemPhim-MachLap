const express = require("express");
const router = express.Router();

const movieTheaterController = require("../Controllers/movieTheaterController");

router.get("/", movieTheaterController.getAllMovieTheater);

router.post("/", movieTheaterController.createMovieTheater);

router.put("/:id", movieTheaterController.updateMovieTheater);

router.delete("/:id", movieTheaterController.deleteMovieTheater);

module.exports = router;
