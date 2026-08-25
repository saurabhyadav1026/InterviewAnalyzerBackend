import express from "express"
import takeTest from "../controllers/student-controller/takeTest.js";
import submitTest from "../controllers/student-controller/submitTest.js";
import getConductedTest from "../controllers/student-controller/getConductedTest.js";
import { addFeedBack } from "../controllers/feedbackController.js";

//import getSubjectList from "../controllers/student-controller/getSubjectList.js";
//import generatePraticeTest, { getTest } from "../controllers/student-controller/generatePraticeTest.js";
//import getTestHistory from "../controllers/student-controller/getTestHistory.js";
//import submitTest from "../controllers/student-controller/submitPraticeTest.js";


const v1Route=express.Router();


/**
 * @swagger
 * tags:
 *   name: Student Operations
 *   description: Core student features like taking tests, submitting attempts, and providing feedback.
 */

/**
 * @swagger
 * /student/getConductedTest:
 *   get:
 *     summary: Fetch active and upcoming tests assigned to the student
 *     tags: [Student Operations]
 *     responses:
 *       200:
 *         description: Successfully fetched assigned tests
 */
v1Route.get("/getConductedTest",getConductedTest);

/**
 * @swagger
 * /student/getTest/{testId}:
 *   get:
 *     summary: Load questions for taking a test (excludes answers for security)
 *     tags: [Student Operations]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully loaded test questions
 */
v1Route.get("/getTest/:testId",takeTest);

/**
 * @swagger
 * /student/submitTest:
 *   post:
 *     summary: Submit and evaluate a test attempt
 *     tags: [Student Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attemptId
 *               - answers
 *             properties:
 *               attemptId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     answer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Successfully submitted test and retrieved evaluation results
 */
v1Route.post("/submitTest",submitTest);

/**
 * @swagger
 * /student/feedback:
 *   post:
 *     summary: Submit feedback for a test
 *     tags: [Student Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feedback
 *             properties:
 *               feedback:
 *                 type: string
 *                 description: The text feedback content
 *               rating:
 *                 type: number
 *                 description: The rating score out of 5
 *               testId:
 *                 type: string
 *                 description: The ID of the test
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       500:
 *         description: Server error
 */
v1Route.post("/feedback",addFeedBack);





/* v1Route.get("/getsubjects",getSubjectList)
v1Route.get("/generateTest",generatePraticeTest)
v1Route.post("/submitTest",submitTest)
v1Route.get("/getTestHistory",getTestHistory)
v1Route.get("/getTest",async(req,res)=>{
 try{ const test=  await getTest(req.query.testId);
    res.status(200).send({status:true,test})
 }catch(err){
    console.log(err);
    res.status(500).send({"status":false,message:"something error. try again later"});
 }
}) */









export default v1Route;