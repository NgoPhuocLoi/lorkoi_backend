const bcrypt = require("bcrypt");
const { User } = require("../models");
const { generateTokens } = require("../utils/generateTokens");
const { getInfoData } = require("../utils");
const ApiError = require("../utils/apiError");

class UserService {
  static async register({ email, password, firstName, lastName, phone }) {
    const holderUser = await User.findOne({ email }).lean();

    if (holderUser) {
      throw new ApiError(409, [
        {
          param: "email",
          msg: "Email has already used!",
        },
      ]);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    });

    if (!newUser)
      throw new ApiError(400, [
        {
          msg: "User created failed",
        },
      ]);

    const tokens = generateTokens({
      userId: newUser._id,
      email,
    });
    console.log("tokens:: ", tokens);
    return {
      user: getInfoData(newUser, ["email", "firstName", "lastName", "phone"]),
      tokens,
    };
  }
  static async login({ email, password }) {
    const user = await User.findOne({ email });

    if (!user)
      throw new ApiError(400, [
        {
          param: "email",
          msg: "Invalid email or password",
        },
      ]);

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword)
      throw new ApiError(400, [
        {
          param: "email",
          msg: "Invalid email or password",
        },
      ]);

    const tokens = generateTokens({ userId: user._id, email: user.email });

    return {
      user: getInfoData(user, ["email", "firstName", "lastName", "phone"]),
      tokens,
    };
  }
}

module.exports = UserService;
