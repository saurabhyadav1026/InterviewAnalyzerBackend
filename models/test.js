import mongoose, { Model } from "mongoose" 

const testSchema=mongoose.Schema({
    userid:{type:String,
        require:true
    },
    questions:{
        type:Array,
        require:true
    },
    ai_analysis:{
        type:String,
        require:true
    }
})

const Test=mongoose.Model("Test",testSchema);
export default Test;
