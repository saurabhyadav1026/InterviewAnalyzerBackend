import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
year:{
  type:Number,
  enum:[1,2,3,4],
  defult:null
},
    questions: [
    {  question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        default :null
      }},
      
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
    },
    category: {
      type: String,
      enum: ['Aptitude', 'DSA', 'Web Dev', 'Problem Solving'],
      default: 'DSA'
    },
    durationMinutes: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Test = mongoose.model("Test", testSchema);

export default Test;