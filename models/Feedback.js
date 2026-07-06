import mongoose from "mongoose";





const FeedbackSchema= mongoose.Schema({

userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
feedback:{
    type:String,
    required:true

},
rating:{
    type:Number,
    enum:[1,2,3,4,5,6,7,8,9,10],
    default:1
}
})


const Feedback= new mongoose.model("Feedback",FeedbackSchema);

export default Feedback;