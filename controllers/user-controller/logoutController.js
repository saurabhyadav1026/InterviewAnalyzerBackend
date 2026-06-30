import jwt from "jsonwebtoken";

export const logoutUser = async (req, res) =>
     {
    try {


        const cookieOptions= {
            httpOnly: true,
            secure:true,
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    
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
