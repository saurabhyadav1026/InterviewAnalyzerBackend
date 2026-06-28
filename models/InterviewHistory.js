import mongoose from "mongoose";

const interviewHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    scorePercent: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    answered: {
        type: Number,
        required: true
    },
    timeTakenSeconds: {
        type: Number,
        required: true
    },
    qna: [{
        questionText: String,
        options: [String],
        correctOptionIndex: Number,
        userSelectedOptionIndex: Number,
        isCorrect: Boolean
    }]
}, { timestamps: true });

const InterviewHistory = mongoose.model("InterviewHistory", interviewHistorySchema);
export default InterviewHistory;
