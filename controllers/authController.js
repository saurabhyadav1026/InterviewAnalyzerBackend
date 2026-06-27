import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

const registerUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Ensure you are sending JSON." });
        }
        
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "User with that email or username already exists" });
        }

        const user = await User.create({ username, name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing." });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};

export { registerUser, loginUser };
