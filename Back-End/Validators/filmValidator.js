const { body, param, query } = require("express-validator");
const { Film } = require("../Models");


// const createCourseValidationRules = () => {
//     return [
//         body("title")
//             .notEmpty()
//             .withMessage("title khong duoc de trong !!!")
//             .isLength({ min: 5, max: 255 })
//             .withMessage("Title phai tu 5 den 255 ki tu !!")
//             .trim(),
//         body("description")
//             .optional()
//             .isLength({ max: 1000 })
//             .withMessage("description không quá 1000 kí tự !!")
//             .trim(),
//         body("credits")
//             .notEmpty()
//             .withMessage("credits khong duoc de trong !!!")
//             .isInt({ min: 1 })
//             .withMessage('credits phải là số nguyên dương')
//             .toInt()
//         ,
//         body("instructorId")
//             .optional({ nullable: true })
//             .isInt({ min: 1 })
//             .withMessage("phai la so nguyen duong ")
//             .toInt()
//             .custom(async (value) => {
//                 if (value) {
//                     const instructor = await Instructor.findByPk(value);
//                     if (!instructor) {
//                         throw new Error("instructor khong ton tai !!");
//                     }
//                 }
//                 return true;
//             }),
//         body("departmentId")
//             .optional({ nullable: true })
//             .isInt({ min: 1 })
//             .withMessage("phai la so nguyen duong ")
//             .toInt()
//             .custom(async (value) => {
//                 if (value) {
//                     const department = await Department.findByPk(value);
//                     if (!department) {
//                         throw new Error("instructor khong ton tai !!");
//                     }
//                 }
//                 return true;
//             }),
//     ]
// }

const getFilmValidationRules = () => {
    return [
        query("title")
            .optional()
            .isString()
            .withMessage('title phai la chuoi')
            .trim(),
        query("format")
            .optional()
            .isIn(['2d', '3d', '4d', '5d'])
            .withMessage('format chỉ được phép là: 2d 3d 4d 5d'),
        query("category")
            .optional()
            .custom((value) => {
                const ids = value.split(",");

                const isValid = ids.every(id => Number.isInteger(Number(id)));

                if (!isValid) {
                    throw new Error("Category phải là danh sách số nguyên");
                }

                return true;
            }),

    ]
}

// const getDetailCouseValidationRules = () => {
//     return [
//         param('id')
//             .notEmpty().withMessage('id là bắt buộc')
//             .toInt()
//             .isInt({ min: 1 })
//             .withMessage('id phải là số nguyên dương >= 1')

//     ]
// }

// const updateCouseValidationRules = () => {
//     return [
//         param('id')
//             .notEmpty().withMessage('id là bắt buộc')
//             .toInt()
//             .isInt({ min: 1 })
//             .withMessage('id phải là số nguyên dương >= 1'),
//         body("title")
//             .notEmpty()
//             .withMessage("title khong duoc de trong !!!")
//             .isLength({ min: 5, max: 255 })
//             .withMessage("Title phai tu 5 den 255 ki tu !!")
//             .trim(),
//         body("description")
//             .optional()
//             .isLength({ max: 1000 })
//             .withMessage("description không quá 1000 kí tự !!")
//             .trim(),
//         body("credits")
//             .notEmpty()
//             .withMessage("credits khong duoc de trong !!!")
//             .isInt({ min: 1 })
//             .withMessage('credits phải là số nguyên dương')
//             .toInt()
//         ,
//         body("instructorId")
//             .optional({ nullable: true })
//             .isInt({ min: 1 })
//             .withMessage("phai la so nguyen duong ")
//             .toInt()
//             .custom(async (value) => {
//                 if (value) {
//                     const instructor = await Instructor.findByPk(value);
//                     if (!instructor) {
//                         throw new Error("instructor khong ton tai !!");
//                     }
//                 }
//                 return true;
//             }),
//         body("departmentId")
//             .optional({ nullable: true })
//             .isInt({ min: 1 })
//             .withMessage("phai la so nguyen duong ")
//             .toInt()
//             .custom(async (value) => {
//                 if (value) {
//                     const department = await Department.findByPk(value);
//                     if (!department) {
//                         throw new Error("instructor khong ton tai !!");
//                     }
//                 }
//                 return true;
//             }),
//     ]
// }

// const deleteCouseValidationRules = () => {
//     return [
//         param('id')
//             .notEmpty().withMessage('id là bắt buộc')
//             .toInt()
//             .isInt({ min: 1 })
//             .withMessage('id phải là số nguyên dương >= 1')

//     ]
// }


module.exports = { getFilmValidationRules };