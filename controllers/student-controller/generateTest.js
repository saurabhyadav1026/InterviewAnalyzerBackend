
import mongoose from "mongoose";
import Question from "../../models/Question.js";
import Test from "../../models/Test.js"




export const generateTest=async(req, res)=>{

    try{
      const subjectId=new mongoose.Types.ObjectId(req.query.subjectId)
    const questions= await Question.aggregate([
  {
    $match: {
      subjectId
      
    }
  },
  {
    $sample: { size: 20 }
  }
]);


// take questions id
const test=await addAndGetTest(req.userId,subjectId,questions.map((doc) =>{ return {question:doc._id}}));


res.status(200).send({status:true,test})

    }catch(err){

        console.log(err);
        res.status(500).send({status:false ,message:"Somthing error. Try again later."})
    }


}

// export default generateTest;


export const addAndGetTest=async(userId,subjectId,questons)=>{

    try{
         const test=await Test.create({userId,subject:subjectId,questons})

         return getTest(test._id);

    }catch(err){

         console.log(err);
         return new Error("test not added");
    }
}





export const getTest=async(testId)=>{

const test = await Test.findById(testId)
    .populate('questions.question')
    .pupulate(subject)

    return test;
}

