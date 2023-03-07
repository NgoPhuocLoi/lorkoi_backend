const router = require("express").Router();
const { body } = require("express-validator");
const ProjectController = require("../controllers/project.controller");
const { asyncHandler } = require("../middlewares/handleError");
const { validate, checkObjectId } = require("../middlewares/validation");

router.post(
  "/",
  body("name").notEmpty().withMessage("Project's name is required"),
  validate,
  asyncHandler(ProjectController.create)
);

router.get("/", asyncHandler(ProjectController.getAll));
router.get("/pinned", asyncHandler(ProjectController.getPinnedProjects));
router.get(
  "/:projectId",
  checkObjectId("projectId"),
  validate,
  asyncHandler(ProjectController.getOne)
);

router.put("/position", asyncHandler(ProjectController.updatePosition));
router.put(
  "/:projectId",
  checkObjectId("projectId"),
  validate,
  asyncHandler(ProjectController.update)
);

router.delete(
  "/:projectId",
  checkObjectId("projectId"),
  validate,
  asyncHandler(ProjectController.delete)
);

module.exports = router;
