import express from "express";
import {addQuestion,deleteQues,updateQuestion} from "../controllers/admin-controller/questionController.js"
import adminMiddleware from "../middlewares/adminMiddleware.js";
import Subject from "../models/Subject.js";

const AddSub= async () => {

  const sub =await Subject.create({name:"DSA"});
console.log("subject added")
  console.log(sub._id)
return sub;
}

const v1AdminRoute =express.Router();


v1AdminRoute.post("/question/add",addQuestion);
v1AdminRoute.post("/question/update/:id",updateQuestion); 
v1AdminRoute.delete("/question/delete/:id",adminMiddleware,deleteQues)


v1AdminRoute.get("/addsub",async(req,res)=>{
    const resp=await AddSub();

    res.send(resp)

})


export default v1AdminRoute;


