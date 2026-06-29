import UpProfile from "../models/UpProfile.js"; 

export const updateProfile = async (req, res) => {
    try {
        
        const profileId = req.user?.id || req.params.id; 
        
        if (!profileId) {
            return res.status(400).json({ success: false, message: "Profile ID is required" });
        }

        
        const { name, email } = req.body;

        // Find and update the document, applying validators and returning the new data
        const updatedProfile = await UpProfile.findByIdAndUpdate(
            profileId,
            //what to upadate
            { name, email },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile
        });

    } catch (error) {
        // Handle Mongoose duplicate key error (e.g., email already exists)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Email is already taken" });
        }

        // Handle structural or connection errors
        return res.status(500).json({ success: false, error: error.message });
    }
};
