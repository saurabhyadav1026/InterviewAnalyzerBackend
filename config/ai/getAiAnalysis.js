import client from "./ai_config.js";
import instruction from "./ai_instruction.js";




const getAiAnalysis=async(message)=>{
    


  try {
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

    return response.choices[0].message.content;
    
  } catch (err) {
    console.error(err);

   return "Failed to load Ai-Analysis report.";
  }
}




export default getAiAnalysis;
 