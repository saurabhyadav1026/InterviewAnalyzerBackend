
import Question from "../../models/Question.js";
import Test from "../../models/Test.js"

const generateTest=async(req, res)=>{

    try{
    const questions= await Question.aggregate([
  {
    $match: {
      subjectId:req.query.subjectId,
      
    }
  },
  {
    $sample: { size: 20 }
  }
]);


const _id=await addTest(questions.map(doc => doc._id.toString()));
res.status(200).send({status:true,_id,questions})

    }catch(err){

        console.log(err);
        res.status(500).send({status:false,_id,questions})
    }


}

export default generateTest;


const addTest=async(questons)=>{

    try{
const test=await Test.create({questons})

return test._id.toString();
    }catch(err){

         console.log(err);
         return new Error("test not added");
    }
}

