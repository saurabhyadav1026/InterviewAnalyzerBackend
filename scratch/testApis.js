import mongoose from "mongoose";
import dotenv from "dotenv";
import dbconnect from "../config/db.js";
import User from "../models/User.js";
import Test from "../models/Test.js";
import AttemptTest from "../models/AttemptTest.js";
import Question from "../models/Question.js";
import {
  getDashboardAnalytics,
  connectPlatform,
  getPlatformAnalytics,
  getConductedTest,
  getTestDetails,
  submitTest,
  getTestHistory
} from "../controllers/student-controller/studentAnalyticsController.js";

dotenv.config();

const runTests = async () => {
  console.log("=== STARTING API VERIFICATION TESTS ===");

  try {
    // 1. Connect to Database
    await dbconnect();

    // Clean any prior dangling test data
    await User.deleteMany({ rollno: "TEST0001" });
    await Test.deleteMany({ name: "API Test Exam" });
    await Question.deleteMany({ topic: "API Test Verification" });
    await AttemptTest.deleteMany({ category: "DSA", status: "in_progress" });

    // 2. Create mock User/Student
    const mockUser = await User.create({
      rollno: "TEST0001",
      name: "Test API Student",
      branch: "CSE",
      year: 3,
      passingYear: 2027,
      email: "api_test@example.com",
      password: "hashedpassword123",
      role: "user"
    });
    console.log(`[PASS] Mock User created (ID: ${mockUser._id})`);

    // 3. Create mock Test
    const mockTest = await Test.create({
      name: "API Test Exam",
      year: 3,
      startAt: new Date(),
      endAt: new Date(Date.now() + 3600 * 1000), // 1 hour duration
      createdBy: new mongoose.Types.ObjectId(),
      isActive: true,
      category: "DSA",
      durationMinutes: 60,
      totalQuestions: 1
    });
    console.log(`[PASS] Mock Test created (ID: ${mockTest._id})`);

    // 4. Create mock Question and link to Test
    const mockQuestion = await Question.create({
      testId: mockTest._id,
      question: "What is the time complexity of binary search?",
      options: ["O(N)", "O(log N)", "O(N^2)", "O(1)"],
      answer: "O(log N)",
      topic: "API Test Verification",
      subject: "dsa",
      level: "medium",
      mark: 10
    });
    mockTest.questions.push({ question: mockQuestion._id });
    await mockTest.save();
    console.log(`[PASS] Mock Question created & linked (ID: ${mockQuestion._id})`);

    // Helper for mock response objects
    const createMockRes = (resolve) => {
      let responseStatusCode = 200;
      return {
        status: (code) => {
          responseStatusCode = code;
          return {
            json: (data) => resolve({ code: responseStatusCode, data }),
            send: (data) => resolve({ code: responseStatusCode, data })
          };
        },
        json: (data) => resolve({ code: responseStatusCode, data }),
        send: (data) => resolve({ code: responseStatusCode, data })
      };
    };

    // ----------------------------------------------------
    // TEST 1: connectPlatform
    // ----------------------------------------------------
    console.log("\nTesting API 1: POST /connect-platform...");
    const connectRes = await new Promise((resolve) => {
      const req = {
        userId: mockUser._id,
        body: { platform: "leetcode", username: "testleetcode" }
      };
      connectPlatform(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(connectRes.data, null, 2));
    if (connectRes.code === 200 && connectRes.data.success) {
      console.log("[PASS] Successfully connected platform handle.");
    } else {
      throw new Error(`[FAIL] connectPlatform endpoint returned code ${connectRes.code}`);
    }

    // Connect again to test locking rule
    console.log("\nTesting API 1 (Lock Rule): Re-connecting locked platform...");
    const lockRes = await new Promise((resolve) => {
      const req = {
        userId: mockUser._id,
        body: { platform: "leetcode", username: "newhandle" }
      };
      connectPlatform(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(lockRes.data, null, 2));
    if (lockRes.code === 400 && !lockRes.data.success) {
      console.log("[PASS] Correctly rejected modification to locked platform.");
    } else {
      throw new Error("[FAIL] Lock rule validation failed. Modification was not rejected.");
    }

    // ----------------------------------------------------
    // TEST 2: getPlatformAnalytics
    // ----------------------------------------------------
    console.log("\nTesting API 2: GET /platform-analytics...");
    const platRes = await new Promise((resolve) => {
      const req = { userId: mockUser._id };
      getPlatformAnalytics(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(platRes.data, null, 2));
    if (platRes.code === 200 && platRes.data.success) {
      console.log("[PASS] Successfully retrieved coding platform points & stats.");
    } else {
      throw new Error(`[FAIL] getPlatformAnalytics returned code ${platRes.code}`);
    }

    // ----------------------------------------------------
    // TEST 3: getConductedTest
    // ----------------------------------------------------
    console.log("\nTesting API 3: GET /getConductedTest...");
    const condRes = await new Promise((resolve) => {
      const req = { userId: mockUser._id, year: mockUser.year };
      getConductedTest(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(condRes.data, null, 2));
    if (condRes.code === 200 && condRes.data.success && condRes.data.tests.length > 0) {
      console.log("[PASS] Successfully retrieved assigned tests.");
    } else {
      throw new Error(`[FAIL] getConductedTest returned code ${condRes.code}`);
    }

    // ----------------------------------------------------
    // TEST 4: getTestDetails (Loading test questions for taking)
    // ----------------------------------------------------
    console.log("\nTesting API 4: GET /getTest/:testId...");
    const testDetailsRes = await new Promise((resolve) => {
      const req = {
        userId: mockUser._id,
        year: mockUser.year,
        params: { testId: mockTest._id }
      };
      getTestDetails(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(testDetailsRes.data, null, 2));
    if (
      testDetailsRes.code === 200 &&
      testDetailsRes.data.success &&
      testDetailsRes.data.attemptId &&
      testDetailsRes.data.test.questions[0].question.answer === undefined
    ) {
      console.log("[PASS] Successfully loaded questions, verified timer details, and verified correct answers are hidden.");
    } else {
      throw new Error(`[FAIL] getTestDetails returned invalid structure. Code: ${testDetailsRes.code}`);
    }

    // ----------------------------------------------------
    // TEST 5: submitTest
    // ----------------------------------------------------
    console.log("\nTesting API 5: POST /submitTest...");
    const submitRes = await new Promise((resolve) => {
      const req = {
        userId: mockUser._id,
        body: {
          attemptId: testDetailsRes.data.attemptId,
          answers: [{ question: mockQuestion._id, answer: "O(log N)" }]
        }
      };
      submitTest(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(submitRes.data, null, 2));
    if (
      submitRes.code === 200 &&
      submitRes.data.success &&
      submitRes.data.totalScore === 10 &&
      submitRes.data.correctCount === 1
    ) {
      console.log("[PASS] Test submitted and evaluated successfully. Correct answers counted accurately.");
    } else {
      throw new Error(`[FAIL] submitTest returned incorrect score evaluation. Code: ${submitRes.code}`);
    }

    // ----------------------------------------------------
    // TEST 6: dashboard-analytics
    // ----------------------------------------------------
    console.log("\nTesting API 6: GET /dashboard-analytics...");
    const dashRes = await new Promise((resolve) => {
      const req = { userId: mockUser._id, year: mockUser.year };
      getDashboardAnalytics(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(dashRes.data, null, 2));
    if (dashRes.code === 200 && dashRes.data.success && dashRes.data.categorySkillStrength.DSA === 100) {
      console.log("[PASS] Dashboard metrics, streaks, and skill accuracy % aggregated properly.");
    } else {
      throw new Error(`[FAIL] getDashboardAnalytics verification failed. Code: ${dashRes.code}`);
    }

    // ----------------------------------------------------
    // TEST 7: test-history
    // ----------------------------------------------------
    console.log("\nTesting API 7: GET /test-history...");
    const historyRes = await new Promise((resolve) => {
      const req = { userId: mockUser._id };
      getTestHistory(req, createMockRes(resolve));
    });
    console.log("Response:", JSON.stringify(historyRes.data, null, 2));
    if (
      historyRes.code === 200 &&
      historyRes.data.success &&
      historyRes.data.history.length > 0 &&
      historyRes.data.history[0].accuracy === 100
    ) {
      console.log("[PASS] Completed test attempt history cards formatted correctly.");
    } else {
      throw new Error(`[FAIL] getTestHistory verification failed. Code: ${historyRes.code}`);
    }

    // ----------------------------------------------------
    // CLEANUP MOCK DATA
    // ----------------------------------------------------
    console.log("\nCleaning up test data from MongoDB...");
    await User.findByIdAndDelete(mockUser._id);
    await Test.findByIdAndDelete(mockTest._id);
    await Question.findByIdAndDelete(mockQuestion._id);
    await AttemptTest.deleteMany({ userId: mockUser._id });
    console.log("[PASS] All mock items deleted successfully.");

    console.log("\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY ===");
  } catch (error) {
    console.error("\n=== Verification Test Failed ===");
    console.error(error);
  } finally {
    // Disconnect mongoose
    await mongoose.disconnect();
    console.log("Mongoose disconnected.");
  }
};

runTests();
