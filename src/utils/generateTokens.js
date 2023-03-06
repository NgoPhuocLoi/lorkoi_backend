const jwt = require("jsonwebtoken");

const generateTokens = (payload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error occur when signing tokens");
  }
};

module.exports = {
  generateTokens,
};
