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

/**
 * @swagger
 * tags:
 *   name: Admin Operations
 *   description: Administrative operations for test creation, test templates, and reports.
 */

/**
 * @swagger
 * /admin/getQuestionEntryTemplateFile:
 *   get:
 *     summary: Retrieve/download the Excel template file for uploading test questions
 *     tags: [Admin Operations]
 *     responses:
 *       200:
 *         description: Excel template file download stream
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
v1AdminRoute.get("/getQuestionEntryTemplateFile",getQuestionEntryTemplateFile);

/**
 * @swagger
 * /admin/generateTest:
 *   post:
 *     summary: Upload an Excel sheet containing questions to generate a new test
 *     tags: [Admin Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel template file containing the test questions
 *               name:
 *                 type: string
 *                 description: Name of the test
 *               year:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *                 description: Target year for the test
 *               startAt:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled start time
 *               endAt:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled end time
 *               category:
 *                 type: string
 *                 enum: [Aptitude, DSA, Web Dev, Problem Solving]
 *                 description: Test category
 *               durationMinutes:
 *                 type: integer
 *                 description: Duration in minutes
 *     responses:
 *       200:
 *         description: Test generated successfully with questions
 *       400:
 *         description: Invalid parameters or formatting errors
 *       500:
 *         description: Server error
 */
v1AdminRoute.post("/generateTest",uploadExcel.single("file"),createTestWithQuestions);

/**
 * @swagger
 * /admin/getConductedTest:
 *   get:
 *     summary: Fetch all tests conducted by admins
 *     tags: [Admin Operations]
 *     responses:
 *       200:
 *         description: Successfully fetched conducted tests list
 *       500:
 *         description: Server error
 */
v1AdminRoute.get("/getConductedTest",getConductedTests);

/**
 * @swagger
 * /admin/checkResult/{testId}:
 *   get:
 *     summary: Generate and export an Excel report containing scores and AI evaluations for all participants in a test
 *     tags: [Admin Operations]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the test to inspect
 *     responses:
 *       200:
 *         description: Participant report Excel sheet download stream
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */
v1AdminRoute.get("/checkResult/:testId",getTestReport);



//v1AdminRoute.put("/deActiveTest/:testId",deActiveTest)
//v1AdminRoute.put("/changeTestSchedule/:id",changeTestSchedule)
//v1AdminRoute.put("/updateQuestion/:id",updateQuestion)

//v1AdminRoute.post("/addQuestionsByExcelFile",addQuestionsByExcelFile)












//for conducting test







export default v1AdminRoute;


