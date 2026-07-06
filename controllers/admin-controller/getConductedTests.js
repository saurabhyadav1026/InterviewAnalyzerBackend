import Test from "../../models/Test.js";



const getConductedTests=async(req,res)=>{

try    {

const tests = await Test.aggregate([
  
  {
    $lookup: {
      from: "questions",
      localField: "questions.question",
      foreignField: "_id",
      as: "questionDocs"
    }
  },
  {
    $addFields: {
      totalQuestions: { $size: "$questions" },
      totalMarks: { $sum: "$questionDocs.mark" }
    }
  },
  {$project:{
    questions:0,
    questionDocs:0
  }}
]);


res.status(200).send({status:true,tests})
}catch(err){
    res.status(500).send({status:false})
}

}


export default getConductedTests;