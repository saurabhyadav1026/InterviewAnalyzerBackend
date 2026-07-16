import Feedback from "../models/Feedback.js";




export const addFeedBack=async(req,res)=>{

   try{ const {comments,rating}=req.body;

   if(!comments || !comments.trim()){
   res.status(300).send({status:false,messsage:"No feedback"})
   }

await Feedback.create({
   userId:req.userId,
    comments,
    rating
});
res.status(200).send({status:true,messsage:"feedback sended."})

   }catch(err){
    console.log(err);
    res.status(500).send({status:false})
   }

}


export const getFeedBacks=(req,res)=>{




}