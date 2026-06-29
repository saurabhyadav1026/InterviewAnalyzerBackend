import mongoose from "mongoose" 

const testSchema=mongoose.Schema({
    userId:{type:String,
        require:true
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
        type:string,
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
    ai_analysis:{
        type:String,
        require:true
    }
})

const Test=mongoose.Model("Test",testSchema);
export default Test;
