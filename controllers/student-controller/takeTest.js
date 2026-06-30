import AttemptTest from "../../models/AttemptTest.js";
import Test from "../../models/Test.js";





export const takeTest = async (req, res) => {
  try {
   const testId=req.params.testId;
    const t= await AttemptTest.findOne({testId,userId:req.userId});
    if(t){
      res.send({status:false,message:"Test already attempted or ongoing."});
      return;
    }
    await AttemptTest.create({userId,testId});
    const test = await Test.findById(testId).populate({path:"questions.question",select:"-answer"})
    return res.status(201).json({ 
      status: true, 
      test
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Failed to initialize test session." });
  }
};


export default takeTest;