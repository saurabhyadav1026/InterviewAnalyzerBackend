import getAiAnalysis from "../../config/ai/getAiAnalysis.js";
import Test from "../../models/PraticeTest.js";





const submitPraticeTest=async(req,res)=>{

    try{
        const {testId,questions}=req.body;
      

const test=await Test.findOneAndUpdate({_id:testId},{$set:{questions,endTime:Date.now()}});


const aiAnalysis=await getAiAnalysis(JSON.stringifyt(test.questions,null,2));

if(aiAnalysis.status){ await Test.findOneAndUpdate({_id:testId},{$set:{aiAnalysis:aiAnalysis.report}});

res.status(200).send({status:true,testId,aiAnalysis}); }
else res.status(200).send({status:true,testId,aiAnalysis:"failed to load AI analysis."}); 

    }catch(err){

        console.log(err);
        res.status(500).send("somthing error. ")
    }

}



export default submitPraticeTest;
