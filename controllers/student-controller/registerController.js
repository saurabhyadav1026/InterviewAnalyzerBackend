import User from "../../models/User.js";



const registerUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Ensure you are sending JSON." });
        }
        
        const { role,name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const userExists = await User.findOne({ email});
        if (userExists) {
            return res.status(400).json({ message: "User with that email or  already exists" });
        }

        const user = await User.create({  role,name, email, password });

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

export default registerUser;
