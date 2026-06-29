import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import adminMiddleware from './adminMiddleware.js';

export default authMiddleware => async (req, res, next) => {
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

