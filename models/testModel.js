import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      }
    ],

    startAt: {
      type: Date,
      required: true
    },

    endAt: {
      type: Date,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Test = mongoose.model("Test", testSchema);

export default Test;