import express from "express";
//import {addQuestion,deleteQues,updateQuestion} from "../controllers/admin-controller/questionController.js"
//import adminMiddleware from "../middlewares/adminAuth.js";
import Subject from "../models/Subject.js";
//import getUsersByDateRange from "../controllers/admin-controller/getUserBydate.js";
import {createTest } from "../controllers/admin-controller/createTest.js";
import getConductedTest from "../controllers/student-controller/getConductedTest.js";
import getQuestionEntryTemplateFile from "../controllers/admin-controller/getQuestionEntryTemplateFile.js";
import  addQuestionsByExcelFile  from "../controllers/admin-controller/addQuestionsByExcelFile.js";
import updateQuestion from "../controllers/admin-controller/updateQuestion.js";
import deActiveTest from "../controllers/admin-controller/deActiveTest.js";
import changeTestSchedule from "../controllers/admin-controller/changeTestSchedule.js";
import addQuestionsForTest from "../controllers/admin-controller/addQuestionsForTest.js";
import { uploadExcel } from "../middlewares/multer.js";
import createTestWithQuestions from "../controllers/admin-controller/createTestWithQuestions.js";
import getConductedTests from "../controllers/admin-controller/getConductedTests.js";
import getTestReport from "../controllers/admin-controller/getTestReport.js";


/* const AddSub= async () => {

  const sub =await Subject.create({name:"DSA"});
console.log("subject added")
  console.log(sub._id)
return sub;
}
 */
const v1AdminRoute =express.Router();


//  v1AdminRoute.post("/addQuestion",adminMiddleware,addQuestion);
//  v1AdminRoute.post("/updateQuestion/:id",adminMiddleware,updateQuestion); 
//  v1AdminRoute.delete("/deleteQuestion/:id",adminMiddleware,deleteQues)
//  v1AdminRoute.get("/usre/bydate",adminMiddleware,getUsersByDateRange)



// for test API

//v1AdminRoute.post("/generateTest",createTest);



v1AdminRoute.get("/getQuestionEntryTemplateFile",getQuestionEntryTemplateFile);
v1AdminRoute.post("/generateTest",uploadExcel.single("file"),createTestWithQuestions);
v1AdminRoute.get("/getConductedTest",getConductedTests);
v1AdminRoute.get("/checkResult/:testId",getTestReport);



//v1AdminRoute.put("/deActiveTest/:testId",deActiveTest)
//v1AdminRoute.put("/changeTestSchedule/:id",changeTestSchedule)
//v1AdminRoute.put("/updateQuestion/:id",updateQuestion)

//v1AdminRoute.post("/addQuestionsByExcelFile",addQuestionsByExcelFile)












//for conducting test







export default v1AdminRoute;


