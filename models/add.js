const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
      unique: true,
   
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    passingYear: {
      type: Number,
      required: true,
    },


    email: {
      type: String,
      required: true,
   
    },


    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);