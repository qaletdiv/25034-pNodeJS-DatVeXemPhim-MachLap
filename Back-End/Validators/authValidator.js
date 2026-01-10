const { body } = require("express-validator");

const { User } = require("../Models");

const registerValidationRules = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name khong duoc de trong !!!")
      .isLength({ max: 50 })
      .withMessage("Name phai tu 3 den 30 ki tu !!")
      .trim(),
    body("email")
      .notEmpty()
      .withMessage("email khong duoc de trong !!!")
      .isEmail()
      .withMessage("Phai dung dinh dang cua Email  !!")
      .normalizeEmail()
      .custom(async (value) => {
        if (value) {
          const email = await User.findOne({
            where: { email: value },
          });
          if (email) {
            throw new Error("Email da ton tai !!");
          }
        }
        return true;
      }),
    body("phone")
      .notEmpty()
      .withMessage("Phone khong duoc de trong !!!")
      .isLength({ min: 10, max: 10 })
      .withMessage("Số điện thoại phải đủ 10 số !!")
      .trim(),
    body("password")
      .notEmpty()
      .withMessage("Password khong duoc de trong !!!")
      .isLength({ min: 8 })
      .withMessage("Password phai co it nhat 8 ki tu  !!"),
    body("confirmPass")
      .notEmpty()
      .withMessage("Password khong duoc de trong !!!")
      .isLength({ min: 8 })
      .withMessage("Password phai co it nhat 8 ki tu  !!")
      .custom((value, { req }) => {
        if (value && value !== req.body.password) {
          throw new Error("Phai nhap giong voi password o buoc tren !!");
        }
        return true;
      }),
  ];
};

const loginValidationRules = () => {
  return [
    body("emailOrPhone")
      .notEmpty()
      .withMessage("Email hoặc số điện thoại không được để trống")
      .custom((value) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isPhone = /^[0-9]{9,15}$/.test(value);

        if (!isEmail && !isPhone) {
          throw new Error("Phải là email hoặc số điện thoại hợp lệ");
        }
        return true;
      }),

    body("password").notEmpty().withMessage("Password không được để trống"),
  ];
};
module.exports = { registerValidationRules, loginValidationRules };
