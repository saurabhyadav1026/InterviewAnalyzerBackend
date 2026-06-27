import mongoose from "mongoose";

const questionSchema = mongoose.Schema({

    question:{
        type: String,
        required: true
    },
    questionImage:{
        type:String
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

    subjectId:{
        type: String,
        required: true
    },

    about:{
        type: String
    }
})


export default mongoose.model("Question",questionSchema);