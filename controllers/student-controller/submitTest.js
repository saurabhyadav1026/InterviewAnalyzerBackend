import Test from "../../models/Test.js";





const submitTest=async(req,res)=>{

    try{
        const {testId,questions}=req.body;
await Test.findAndUpdateOne({_id:testId},{$set:{questions,endTime:Date.now()}});


const test= await Test.findById(testId,{_id:-1,_v:-1});
const aiAnalysis=await getAiAnalysis(test);

await Test.findAndUpdateOne({_id:testId},{$set:{aiAnalysis}});

res.status(200).send({status:true,testId,aiAnalysis});

    }catch(err){

        console.log(err);
        res.status(500).send("somthing error. ")
    }

}



export default submitTest;

const getAiAnalysis=async(test)=>{
    return "Ai Report"
}