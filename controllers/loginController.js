import User from "../models/user.js";
import bcrypt from "bcrypt";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userResponse = user.toObject();

    delete userResponse.password;

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default login
