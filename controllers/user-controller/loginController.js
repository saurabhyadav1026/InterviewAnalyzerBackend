import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

const loginUser = async (req, res) => {
    console.log("Login attempt initiated");
    try {
        const { identifier, password } = req.body;

        // Ab 'role' yahan mandatory nahi hai
        if (!identifier || !password) {
            return res.status(400).json({
                message: "Please provide password and either email or roll number."
            });
        }

        // Dynamic query object banayenge
        const query = {
            $or: [
                { email: identifier },
                { rollNo: identifier }
            ]
        };

        

        // Database search
        const user = await User.findOne(query);

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const refreshToken = generateToken({ userId: user._id, role: user.role });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: true,
            user: {
                _id: user._id,
                rollno:user.rollno,
                name:user.name,
                branch:user.branch,
                passingyear:user.passingyear,
                email:user.email

            },
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during login",
            error: error.message
        });
    }
}

export default loginUser;