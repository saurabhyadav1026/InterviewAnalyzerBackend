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
    { question:{ type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true },
  answer:{type:String,default:null}
  }
  ],
  correctAnswers:{
    type:Number,
    default:null

  },
  aiAnalysis:{
    type:Object,
    default:null
  }
  
}, { timestamps: true });

// Enforce one single attempt structure per user per test instance
AttemptTestSchema.index({ userId: 1, testId: 1 }, { unique: true });

const AttemptTest = mongoose.model("AttemptTest", AttemptTestSchema);
export default AttemptTest;
