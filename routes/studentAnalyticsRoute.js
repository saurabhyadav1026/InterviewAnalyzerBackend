import express from "express";
import {
  getDashboardAnalytics,
  connectPlatform,
  getPlatformAnalytics,
  getConductedTest,
  getTestDetails,
  submitTest,
  getTestHistory
} from "../controllers/student-controller/studentAnalyticsController.js";

const studentAnalyticsRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Student Analytics
 *   description: APIs for Student dashboard metrics, coding platforms connect/analytics, and test history.
 */

/**
 * @swagger
 * /student/dashboard-analytics:
 *   get:
 *     summary: Fetch dashboard metrics, day streak, total score, and category skill strength percentages
 *     tags: [Student Analytics]
 *     responses:
 *       200:
 *         description: Successfully fetched dashboard analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalAssignedCount:
 *                   type: integer
 *                 completedCount:
 *                   type: integer
 *                 averageScorePercent:
 *                   type: number
 *                 streak:
 *                   type: integer
 *                 totalScore:
 *                   type: number
 *                 categorySkillStrength:
 *                   type: object
 *                   properties:
 *                     Aptitude:
 *                       type: integer
 *                     DSA:
 *                       type: integer
 *                     Web Dev:
 *                       type: integer
 *                     Problem Solving:
 *                       type: integer
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.get("/dashboard-analytics", getDashboardAnalytics);

/**
 * @swagger
 * /student/connect-platform:
 *   post:
 *     summary: Connect a student handle to a coding platform (locks permanently upon connection)
 *     tags: [Student Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *               - username
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [leetcode, gfg, codeforces, hackerrank, github]
 *                 description: The name of the coding platform
 *               username:
 *                 type: string
 *                 description: The handle username on that platform
 *     responses:
 *       200:
 *         description: Successfully connected/updated platform handle
 *       400:
 *         description: Platform already locked or invalid platform name
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.post("/connect-platform", connectPlatform);

/**
 * @swagger
 * /student/platform-analytics:
 *   get:
 *     summary: Fetch live stats from connected coding platforms & calculate points
 *     tags: [Student Analytics]
 *     responses:
 *       200:
 *         description: Successfully fetched live platform points and stats
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.get("/platform-analytics", getPlatformAnalytics);

/**
 * @swagger
 * /student/getConductedTest:
 *   get:
 *     summary: Fetch active and upcoming tests assigned to the student's year, sorted descending by upload time
 *     tags: [Student Analytics]
 *     responses:
 *       200:
 *         description: Successfully fetched assigned tests
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.get("/getConductedTest", getConductedTest);

/**
 * @swagger
 * /student/getTest/{testId}:
 *   get:
 *     summary: Load test details, timer, and questions (excluding correct answers) for exam taking
 *     tags: [Student Analytics]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the test
 *     responses:
 *       200:
 *         description: Successfully loaded test questions and details
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.get("/getTest/:testId", getTestDetails);

/**
 * @swagger
 * /student/submitTest:
 *   post:
 *     summary: Evaluate answers, save correctness, get AI feedback, and submit test
 *     tags: [Student Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attemptId:
 *                 type: string
 *                 description: Optional. The ID of the attempt session
 *               testId:
 *                 type: string
 *                 description: Optional. The ID of the test (if attemptId is not provided)
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: The ID of the question
 *                     answer:
 *                       type: string
 *                       description: The selected answer option string
 *     responses:
 *       200:
 *         description: Successfully evaluated and submitted test
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.post("/submitTest", submitTest);

/**
 * @swagger
 * /student/test-history:
 *   get:
 *     summary: Fetch completed test performance history (accuracy, score, duration)
 *     tags: [Student Analytics]
 *     responses:
 *       200:
 *         description: Successfully fetched test attempt history
 *       500:
 *         description: Server error
 */
studentAnalyticsRoute.get("/test-history", getTestHistory);

export default studentAnalyticsRoute;
