const router = require("express").Router();
const { verifyToken } = require("../middlewares/tokenHandler");

router.use("/auth", require("./auth.route"));
router.use("/project", verifyToken, require("./project.route"));
router.use(
  "/project/:projectId/section",
  verifyToken,
  require("./section.route")
);
router.use("/project/:projectId/task", verifyToken, require("./task.route"));

module.exports = router;
