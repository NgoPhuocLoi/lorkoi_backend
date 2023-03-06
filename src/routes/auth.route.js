const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validation");

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("phone")
    .isMobilePhone("vi-VN")
    .withMessage("Invalid phone number format"),
  body("firstName").notEmpty().withMessage("First Name is required"),
  body("lastName").notEmpty().withMessage("Last Name is required"),
  validate,
  UserController.register
);
router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  validate,
  UserController.login
);

module.exports = router;
