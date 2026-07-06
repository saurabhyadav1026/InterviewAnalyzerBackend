import mongoose from "mongoose";
import AttemptTest from "../../models/AttemptTest.js";
import Test from "../../models/Test.js";





export const takeTest = async (req, res) => {
  try {
   const testId=req.params.testId;
 

    const t= await Test.find({_id:testId,isActive:true});
    if(!test){
      res.status(401).send({status:false,message:"test is not available."});
      return;
    }
   let userId = new mongoose.Types.ObjectId(req.userId );   ;
    let attempt= await AttemptTest.findOne({testId,userId});
    if(!attempt){
          attempt=await AttemptTest.create({userId,testId});
      //res.send({status:false,message:"Test already attempted or ongoing."});
      //return;
    
    }

const year = req.year ;
    const test = await Test.findOne({_id:testId,isActive:true,year:year}).populate({path:"questions.question",select:"-answer"})
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
