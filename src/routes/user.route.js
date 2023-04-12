const UserController = require("../controllers/user.controller");
const { asyncHandler } = require("../middlewares/handleError");

const router = require("express").Router();

router.get("/", asyncHandler(UserController.getCurrentUser));
router.get("/all", asyncHandler(UserController.getAllUsers));
router.get("/:userId", asyncHandler(UserController.getUser));

module.exports = router;
