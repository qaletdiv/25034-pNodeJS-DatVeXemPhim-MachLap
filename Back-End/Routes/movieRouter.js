const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const handleValidateErrors = require("../Middlewares/handleValidate");
const authenticateToken = require("../Middlewares/authenticateToken");
const authorizeRole = require("../Middlewares/authorizeRole");
const {
  getMovieValidationRules,
  getDetailMovieValidationRules,
} = require("../Validators/movieValidator");
const movieController = require("../Controllers/movieController");

router.get(
  "/",
  getMovieValidationRules(),
  handleValidateErrors,
  movieController.getAllMovie,
);

router.get(
  "/get-movies-admin",
  authenticateToken,
  authorizeRole("admin"),
  movieController.getAvailableMovies,
);

router.get(
  "/:id",
  getDetailMovieValidationRules(),
  handleValidateErrors,
  movieController.getDetailMovie,
);

router.post(
  "/",
  // createCourseValidationRules(),
  // handleValidateErrors,
  movieController.createMovie,
);

// router.put("/:id",
//     updateCouseValidationRules(),
//     handleValidateErrors,
//     courseController.updateCourse);

// router.delete("/:id",
//     deleteCouseValidationRules(),
//     handleValidateErrors,
//     courseController.removeCourse);

module.exports = router;
