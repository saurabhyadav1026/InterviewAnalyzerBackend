import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

const loginUser = async (req, res) => {
    console.log("you will get loggin")
    try {
        const {role, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ email,role });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const refreshToken = generateToken({userId:user._id,role:user.role});

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:true,
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json(
            {
            status:true,user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: "Login successful"
        }
    }
    );

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during login",
            error: error.message
        });
    }
};

export default loginUser;