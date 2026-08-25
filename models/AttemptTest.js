import mongoose from "mongoose";

const AttemptTestSchema = new mongoose.Schema({

startAt:{
  type:Date,
  default:Date.now
},
endAt:{
  type:Date,
  default:null
},
    //userID
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  //testId
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },



  //status
  status: {
    type: String,
    enum: ['in_progress', 'submitted'],
    default: 'in_progress'
  },

   answers:[
    { 
      question: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true 
      },
      answer: { type: String, default: null },
      isCorrect: { type: Boolean, default: false }
    }
  ],
  correctAnswers:{
    type:Number,
    default:null

  },
  score:{
    type:Number,
    default:0

  },
  aiAnalysis:{
    type:String,
    default:null
  },
  category: {
    type: String,
    enum: ['Aptitude', 'DSA', 'Web Dev', 'Problem Solving'],
    default: 'DSA'
  }
  
}, { timestamps: true });

// Enforce one single attempt structure per user per test instance
AttemptTestSchema.index({ userId: 1, testId: 1 }, { unique: true });

const AttemptTest = mongoose.model("AttemptTest", AttemptTestSchema);
export default AttemptTest;
