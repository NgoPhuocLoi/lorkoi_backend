const router = require("express").Router();
const { verifyToken } = require("../middlewares/tokenHandler");

router.use("/auth", require("./auth.route"));
router.use("/project", verifyToken, require("./project.route"));

module.exports = router;
