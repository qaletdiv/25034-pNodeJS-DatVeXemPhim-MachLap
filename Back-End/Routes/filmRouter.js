const express = require("express");
const router = express.Router();
const handleValidateErrors = require("../Middlewares/handleValidate");
const { getFilmValidationRules } = require("../Validators/filmValidator");
const { Op } = require("sequelize");
const filmController = require("../Controllers/filmController")

router.get("/",
    getFilmValidationRules(),
    handleValidateErrors,
    filmController.getAllFilm
);

// router.get("/:id",
//     getDetailCouseValidationRules(),
//     handleValidateErrors,
//     courseController.getCourseDetail
// );

router.post("/",
    // createCourseValidationRules(),
    // handleValidateErrors,
    filmController.createFilm);

// router.put("/:id",
//     updateCouseValidationRules(),
//     handleValidateErrors,
//     courseController.updateCourse);


// router.delete("/:id",
//     deleteCouseValidationRules(),
//     handleValidateErrors,
//     courseController.removeCourse);

module.exports = router;
