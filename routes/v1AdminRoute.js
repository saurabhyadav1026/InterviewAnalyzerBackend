import express from "express";
import {addQuestion,updateQuestion} from "../controllers/admin-controller/questionController.js"



const v1AdminRoute =express.Router();


v1AdminRoute.post("/question/add",addQuestion);
v1AdminRoute.post("/question/update/:id",updateQuestion); 
v1AdminRoute.delete("/question/delete/:id",adminMiddleware,deleteQues)

export default v1AdminRoute;