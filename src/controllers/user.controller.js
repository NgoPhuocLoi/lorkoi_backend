const ApiError = require("../utils/apiError");
const UserService = require("../services/user.service");

class UserController {
  static async register(req, res, next) {
    const data = await UserService.register(req.body);

    return res.status(201).json({
      data,
    });
  }

  static async login(req, res, next) {
    const data = await UserService.login(req.body);
    return res.status(200).json({
      data,
    });
  }
}

module.exports = UserController;
