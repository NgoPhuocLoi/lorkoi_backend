const { asyncHandler } = require("../middlewares/handleError");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
