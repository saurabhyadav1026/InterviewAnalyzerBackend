import User from "../../models/User.js";



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
            res.status(201).json({status:true,msg:"Register successfully"});
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};

<<<<<<< HEAD:controllers/authController.js
export { registerUser,loginUser};
=======
export default registerUser;
>>>>>>> 93e755fbf2a8fab6b63a7161f98a8e50d8747d41:controllers/registerController.js
