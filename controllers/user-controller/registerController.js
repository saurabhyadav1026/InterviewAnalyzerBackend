import User from "../../models/User.js"; 

export const registerController = async (req, res) => {
  try {
    const {
      rollno,
      name,
      branch,
      passingYear,
      email,
      password,
    } = req.body;

    // Check if all fields are provided
    if (
      !rollno ||
      !name ||
      !branch ||
      !passingYear ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { rollno }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Roll number already registered",
      });
    }

    // Create new user
    const user = await User.create({
      rollno,
      name,
      branch,
      passingYear,
      email,
      password, // Will be hashed automatically by pre("save")
    });

    // Remove password from response
    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default registerController;