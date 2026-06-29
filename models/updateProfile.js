import mongoose from "mongoose";

const updateProfile = new mongoose.Schema({
   
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
              trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    }});
    
    export default mongoose.model("UpProfile", updateProfile);