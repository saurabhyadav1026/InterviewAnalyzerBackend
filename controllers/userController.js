import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Groq from 'groq-sdk';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                extractedSkills: user.extractedSkills,
                resumeText: user.resumeText,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user profile (name, username, email)
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Check if username/email being updated already exists for a DIFFERENT user
            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) return res.status(400).json({ message: 'Email already in use' });
            }
            if (req.body.username && req.body.username !== user.username) {
                const usernameExists = await User.findOne({ username: req.body.username });
                if (usernameExists) return res.status(400).json({ message: 'Username already in use' });
            }

            user.name = req.body.name || user.name;
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            if (req.body.avatar !== undefined) {
                user.avatar = req.body.avatar;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const { currentPassword, newPassword } = req.body;
            
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Please provide current and new password' });
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid current password' });
            }

            // user model pre-save hook handles hashing
            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Upload resume PDF and extract skills using Groq
// @route   POST /api/user/resume
// @access  Private
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }
        
        // 1. Parse the PDF
        const data = await pdfParse(req.file.buffer);
        const resumeText = data.text;
        
        // 2. Setup Groq
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ message: "GROQ_API_KEY is not configured in backend." });
        }
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        // 3. Prompt AI to extract skills
        const prompt = `Extract a concise list of technical skills, frameworks, languages, and core tools from the following resume text. Output ONLY a comma-separated list of skills, nothing else. Do not use quotes or markdown.\n\nResume Text:\n${resumeText.substring(0, 5000)}`;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
            temperature: 0.1, // keep it factual
        });
        
        const responseText = chatCompletion.choices[0]?.message?.content || "";
        const skillsArray = responseText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        // 4. Save to user
        const user = await User.findById(req.user._id);
        user.resumeText = resumeText;
        user.extractedSkills = skillsArray;
        await user.save();
        
        res.status(200).json({ success: true, skills: skillsArray });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        res.status(500).json({ message: "Failed to process resume", error: error.message });
    }
};
