
import mongoose from "mongoose";
import Question from "../../models/Question.js";
import Test from "../../models/PraticeTest.js"




const generatePraticeTest=async(req, res)=>{

    try{
      const subject=new mongoose.Types.ObjectId(req.query.subject)
    const questions= await Question.aggregate([
  {
    $match: {
     subject
      
    }
  },
  {
    $sample: { size: 20 }
  }
]);


// take questions id
const test=await addAndGetTest(req.userId,subject,questions.map((doc) =>{ return {question:doc._id}}));


res.status(200).send({status:true,test})

    }catch(err){

        console.log(err);
        res.status(500).send({status:false ,message:"Somthing error. Try again later."})
    }


}

export default generatePraticeTest;


export const addAndGetTest=async(userId,subjectId,questions)=>{

    try{
const test=await Test.create({userId,subject:subjectId,questions})

return getTest(test._id);

    }catch(err){

         console.log(err);
         return new Error("test not added");
    }
}





export const getTest=async(testId)=>{

const test = await Test.findById(testId)
    .populate('questions.question')
    .populate('subject')

    return test;
}

