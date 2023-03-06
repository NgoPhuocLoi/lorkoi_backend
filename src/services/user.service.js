const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { generateTokens } = require("../utils/generateTokens");
const { getInfoData } = require("../utils");

class UserService {
  static async register({ email, password, firstName, lastName, phone }) {
    try {
      const holderUser = await User.findOne({ email }).lean();

      if (holderUser) {
        return {
          err: true,
          message: "Email has already existed",
          metadata: null,
        };
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
        return {
          err: true,
          message: "Create user failed",
          metadata: null,
        };

      const tokens = generateTokens({
        userId: newUser._id,
        email,
      });
      console.log("tokens:: ", tokens);
      return {
        err: false,
        message: "Create user successfully",
        metadata: {
          user: getInfoData(newUser, [
            "email",
            "firstName",
            "lastName",
            "phone",
          ]),
          tokens,
        },
      };
    } catch (error) {
      return {
        err: true,
        message: error.message,
        metadata: null,
      };
    }
  }
}

module.exports = UserService;
