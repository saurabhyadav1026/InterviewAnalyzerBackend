import express from "express";
//import {addQuestion,deleteQues,updateQuestion} from "../controllers/admin-controller/questionController.js"
//import adminMiddleware from "../middlewares/adminAuth.js";
import Subject from "../models/Subject.js";
//import getUsersByDateRange from "../controllers/admin-controller/getUserBydate.js";
import {createTest } from "../controllers/admin-controller/createTest.js";
import getTestReport from "../controllers/admin-controller/getTestReport.js";
import getConductedTest from "../controllers/student-controller/getConductedTest.js";



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


v1AdminRoute.get("/generateTest",createTest);
v1AdminRoute.get("/checkResult",getTestReport);
v1AdminRoute.get("/getConductedTest",getConductedTest);




export default v1AdminRoute;


