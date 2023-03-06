const ApiError = require("../utils/apiError");
const UserService = require("../services/user.service");

class UserController {
  static async register(req, res, next) {
    try {
      const response = await UserService.register(req.body);

      if (response.err) {
        return next(new ApiError(400, response.message));
      }

      return res.status(201).json({
        data: response.metadata,
      });
    } catch (error) {
      next(new ApiError(500, "An error occur when registering new user"));
    }
  }

  static async login(req, res, next) {
    try {
      res.json({ message: "login" });
    } catch (error) {
      next(new ApiError(500, "An error occur when login"));
    }
  }
}

module.exports = UserController;
