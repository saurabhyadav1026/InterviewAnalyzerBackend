const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {

    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token provided"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (err) {
    console.log("JWT ERROR =>", err.message);

    return res.status(401).json({
      message: "Invalid refresh token"
    });
  }
};