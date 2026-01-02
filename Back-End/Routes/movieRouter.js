const express = require("express");
const router = express.Router();
const handleValidateErrors = require("../Middlewares/handleValidate");
const { getMovieValidationRules } = require("../Validators/movieValidator");
const { Op } = require("sequelize");
const movieController = require("../Controllers/movieController");

router.get(
  "/",
  getMovieValidationRules(),
  handleValidateErrors,
  movieController.getAllMovie
);

// router.get("/:id",
//     getDetailCouseValidationRules(),
//     handleValidateErrors,
//     courseController.getCourseDetail
// );

router.post(
  "/",
  // createCourseValidationRules(),
  // handleValidateErrors,
  movieController.createMovie
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
