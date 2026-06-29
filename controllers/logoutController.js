import jwt from "jsonwebtoken";

export const logoutUser = async (req, res) =>
     {
    try {
const refreshTokenFromBody = req.body ? req.body.refreshToken : null;


        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
            path: "/" 
        };
        
        
        res.clearCookie("token", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logout successful. Session cache cleared."
        });

    } catch (error) {
        console.error("Logout Controller Crash Exception Error Stack:", error);
        return res.status(500).json({
            success: false,
            message: "Server error occurred executing user logout cleanup."
        });
    }
};
