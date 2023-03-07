const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ApiError(400, errors.errors));
  }
  next();
};

module.exports = {
  validate,
};
