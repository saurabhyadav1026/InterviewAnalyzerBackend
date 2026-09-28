import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      try {
        if (error) {
          return res.status(401).json({
            message: "Invalid refresh token",
          });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          return res.status(401).json({
            message: "User not found",
          });
        }

        req.userId = user._id;
        req.role = user.role;

        if (user.role !== "admin") {
          req.year = user.year;
        }

        return next();
      } catch (err) {
        console.log("USER AUTH ERROR =>", err.message);

        return res.status(401).json({
          message: "Invalid refresh token",
        });
      }
    });
  } catch (err) {
    console.log("JWT ERROR =>", err.message);

    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

export default userAuth;