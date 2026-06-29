import mongoose from "mongoose" 

const testSchema=mongoose.Schema({
    userId:{type:String,
        required:true
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },

    questions:[{question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    },
    answer:{
        type:String,
        default:null
    },
    isCorrect:{
        type:Boolean,
        default:null
    }

}],

    startTime:{
        type:Date,
        default:Date.now
    },
    endTime:{
        type:Date,
        default:null
    },
    aiAnalysis:{
        type:String,
        default:null
    }
})

const Test=mongoose.model("Test",testSchema);
export default Test;
