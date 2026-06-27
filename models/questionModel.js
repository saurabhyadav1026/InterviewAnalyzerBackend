import mongoose from "mongoose"

const questionSchema = mongoose.Schema({
    questionId : Number,

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
        type: Number,
        required: true
    },

    about:{
        type: String
    }
})


const question = mongoose.model("question",questionSchema)

export default question;