
import mongoose from "mongoose";
import Question from "../../models/Question.js";
import Test from "../../models/Test.js"
import Subject from "../../models/Subject.js";




const generateTest=async(req, res)=>{

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

console.log(questions)



// take questions id
const test=await addAndGetTest(req.userId,subjectId,questions.map((doc) =>{ return {question:doc._id}}));


res.status(200).send({status:true,test})

    }catch(err){

        console.log(err);
        res.status(500).send({status:false ,message:"Somthing error. Try again later."})
    }


}

export default generateTest;


const addAndGetTest=async(userId="sbh",subjectId,questions)=>{
console.log(questions)
    try{
const test=await Test.create({userId,subject:subjectId,questions})
console.log(test)
return getTest(test._id);

    }catch(err){

         console.log(err);
         return new Error("test not added");
    }
}







const getTest=async(testId)=>{

const test = await Test.findById(testId)
    .populate('questions.question')
    .populate('subject')

    return test;
}
