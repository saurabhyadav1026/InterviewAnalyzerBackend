import mongoose from "mongoose";
import AttemptTest from "../../models/AttemptTest.js";
import Test from "../../models/Test.js";





export const takeTest = async (req, res) => {
  try {
   const testId=req.params.testId;
   let userId = new mongoose.Types.ObjectId(req.userId);  //||"6a434c2a8fc788660ccc763b") ;
    const t= await AttemptTest.findOne({testId,userId});
    if(t){
      res.send({status:false,message:"Test already attempted or ongoing."});
      return;
    }
    const attempt=await AttemptTest.create({userId,testId});
    const test = await Test.findById(testId).populate({path:"questions.question",select:"-answer"})
    return res.status(201).json({ 
      status: true, 
      test,
      attemptId: attempt._id
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Failed to initialize test session." });
  }
};


export default takeTest;