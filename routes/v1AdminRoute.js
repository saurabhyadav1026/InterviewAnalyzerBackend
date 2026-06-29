import express from "express";
import {addQuestion,updateQuestion} from "../controllers/admin-controller/questionController.js"
import {generateTest,addAndGetTest,getTest} from "../controllers/student-controller/generateTest.js"


const v1AdminRoute =express.Router();


v1AdminRoute.post("/question/add",adminMiddleware,addQuestion);
v1AdminRoute.post("/question/update/:id",adminMiddleware,updateQuestion); 
v1AdminRoute.delete("/question/delete/:id",adminMiddleware,deleteQues)
v1AdminRoute.post("/test/generatetest",generateTest);
v1AdminRoute.post("/test/addtest",addAndGetTest);
v1AdminRoute.get("/test/addtest",getTest);

export default v1AdminRoute;