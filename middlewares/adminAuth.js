




const adminAuth = async(req, res, next) =>  {
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

    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user || user.role!=="admin") {
      return res.status(401).json({
        message: "session expire."
      });
    }

    req.userId = user.userId;
    req.role=user.role;

    next();

  } catch (err) {
    console.log("JWT ERROR =>", err.message);

    return res.status(401).json({
      message: "Invalid refresh token"
    });
  }
};


export default adminAuth;