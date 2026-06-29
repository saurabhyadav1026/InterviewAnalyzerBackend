import express from "express";
import {addQuestion,deleteQues,updateQuestion} from "../controllers/admin-controller/questionController.js"
import adminMiddleware from "../middlewares/adminMiddleware.js";
import Subject from "../models/Subject.js";
import Question from "../models/Question.js";
import dsaQuestion from "../Questions/dsaQuestion.js";
import getUsersByDateRange from "../controllers/admin-controller/getUserBydate.js";

const AddSub= async () => {

  const sub =await Subject.create({name:"DSA"});
console.log("subject added")
  console.log(sub._id)
return sub;
}

const v1AdminRoute =express.Router();


v1AdminRoute.post("/question/add",adminMiddleware,addQuestion);
v1AdminRoute.post("/question/update/:id",adminMiddleware,updateQuestion); 
v1AdminRoute.delete("/question/delete/:id",adminMiddleware,deleteQues)
v1AdminRoute.get("/usre/bydate",adminMiddleware,getUsersByDateRange)


v1AdminRoute.get("/addsub",async(req,res)=>{
    const question= await Question.insertMany(dsaQuestion)
    res.send(question[0])

})


export default v1AdminRoute;


