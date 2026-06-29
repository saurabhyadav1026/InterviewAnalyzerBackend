
// does CRUD operations

import Subject from "../models/Subject.js";
import mongoose from "mongoose";



export const addSubject = async (req, res) => {
    try {
        const { name } = req.body;

        //no name  given
        if (!name || name.trim() === "") {
            return res.status(400).json({ 
                success: false, 
                message: "Subject name is required." 
            });
        }

        // Check if subject name already exists (case-insensitive check)
        const subjectExists = await Subject.findOne({ 
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") } 
        });

        if (subjectExists) {
            return res.status(400).json({ 
                success: false, 
                message: "This subject already exists." 
            });
        }

        const newSubject = await Subject.create({
            name: name.trim()
        });

        
        return res.status(201).json({
            success: true,
            message: "Subject created successfully",
            subject: newSubject
        });

    } catch (error) {
        console.error("Create Subject Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while creating subject." 
        });
    }
};




// @desc    User/Admin: Get a list of all subjects (for dashboard cards)
// @route   GET /api/subjects
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({}).sort({ name: 1 }); // Sorted alphabetically

        return res.status(200).json({
            success: true,
            count: subjects.length,
            subjects: subjects
        });

    } catch (error) {
        console.error("Get All Subjects Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while fetching subjects." 
        });
    }
};

// @desc    Admin: Update a subject name
// @route   PUT /api/subjects/:id
export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Subject ID format." 
            });
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({ 
                success: false, 
                message: "Updated subject name cannot be empty." 
            });
        }

        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { name: name.trim() },
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({ 
                success: false, 
                message: "Subject not found." 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            subject: updatedSubject
        });

    } catch (error) {
        console.error("Update Subject Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while updating subject." 
        });
    }
};



// @desc    Admin: Delete a subject
// @route   DELETE /api/subjects/:id

export const deleteSubject = async (req, res) => {


    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Subject ID format." 
            });
        }


        const deletedSubject = await Subject.findByIdAndDelete(id);

        if (!deletedSubject) {
            return res.status(404).json({ 
                success: false, 
                message: "Subject not found or already deleted." 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
            deletedId: id
        });

    } catch (error) {
        console.error("Delete Subject Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while deleting subject." 
        });
    }
};
