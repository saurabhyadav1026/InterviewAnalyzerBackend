import mongoose from "mongoose";

const takesTestSchema = new mongoose.Schema({


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


  //test
  test: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    startAt: {
      type: Date,
      default: Date.now
    },
    startEnd: {
      type: Date,
      required: true
    },


    //question
    question: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true
        },
        question: {
          type: String,
          required: true
        },
        questionImage: {
          type: String,
          default: null
        },
        options: [{
          type: String,
          required: true
        }],
        answer: {
          type: String,
          required: true // Stored securely to grade later on submission
        },
        userResponse: {
          type: String,
          default: null
        },
        isCorrect: {
          type: Boolean,
          default: false
        }
      }
    ]
  
  }
}, { timestamps: true });

// Enforce one single attempt structure per user per test instance
takesTestSchema.index({ userId: 1, testId: 1 }, { unique: true });

const TakesTest = mongoose.model("TakesTest", takesTestSchema);
export default TakesTest;
