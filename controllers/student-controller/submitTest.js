import client from "../../config/ai_config.js";
import instruction from "../../config/ai_instruction.js";
import Test from "../../models/Test.js";





const submitTest=async(req,res)=>{

    try{
        const {testId,questions}=req.body;
      

const test=await Test.findOneAndUpdate({_id:testId},{$set:{questions,endTime:Date.now()}});


const aiAnalysis=await getAiAnalysis(test.questions);

if(aiAnalysis.status){ await Test.findOneAndUpdate({_id:testId},{$set:{aiAnalysis:aiAnalysis.report}});

res.status(200).send({status:true,testId,aiAnalysis}); }
else res.status(200).send({status:true,testId,aiAnalysis:"failed to load AI analysis."}); 

    }catch(err){

        console.log(err);
        res.status(500).send("somthing error. ")
    }

}



export default submitTest;

const getAiAnalysis=async(questions)=>{
    


  try {
   
    const  message  = JSON.stringify(questions,null,2)  //req.query;
    console.log(message)

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        {
          role: "system",
          content: instruction,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 500,
    });

    return {
      status: true,
      report:JSON.parse(response.choices[0].message.content),
    };
  } catch (err) {
    console.error(err);

   return {
      status: false,
      error: err.message,
    };
  }
}





 