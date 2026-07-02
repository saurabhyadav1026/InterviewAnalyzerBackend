import mongoose from "mongoose";

const questionSchema = mongoose.Schema({

    question:{
        type: String,
        required: true
    },
    questionImage:{
        type:String,
        default:null
    },

    options:[{
        type:String,
        required: true
    }],

    answer:{
        type: String,
        required: true
    },

    topic:{
        type: String,
        required: String
    },

    subject: {
        type:String,
        enum: ['dsa', 'aptitude', 'programming', 'generalKnowledge'],
        default: 'dsa'
    },
 level: {
        type:String,
        enum: ['easy', 'medium', 'hard'],
        default: 'dsa'
    },

    about:{
        type: String
    },
    mark:{
        type:Number,
        default:2
    }
})


const Question = mongoose.model("Question",questionSchema);

export default Question;
