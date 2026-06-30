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

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
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
