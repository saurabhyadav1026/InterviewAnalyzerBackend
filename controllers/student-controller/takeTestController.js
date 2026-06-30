import TakesTest from "../../models/TakesTest.js"; 

import { getTest } from "./generateTest.controller.js"; 


export const takeTest = async (req, res) => {
  try {
    const { testId } = req.body; // Pass the _id of the test created by generateTest
    const userId = req.userId;

    if (!testId) {
      return res.status(400).json({ status: false, message: "testId is required." });
    }

    // 1. Prevent duplicate active attempts for the same test instance
    const existingAttempt = await TakesTest.findOne({ userId, testId });
    if (existingAttempt) {
      return res.status(400).json({ status: false, message: "Test session already started or taken by this user." });
    }

    // 2. Fetch the fully populated test layout using your existing helper
    const testConfig = await getTest(testId);
    if (!testConfig) {
      return res.status(404).json({ status: false, message: "Generated test configuration not found." });
    }

    // 3. Snapshot the generated questions into the user's active session tracking structure
    const questionsSnapshot = testConfig.questions.map((item) => ({
      questionId: item.question._id,
      question: item.question.question,
      questionImage: item.question.questionImage || null,
      options: item.question.options,
      answer: item.question.answer, // Stored safely to grade later in your submitTest controller
      userResponse: null,
      isCorrect: false
    }));

    // 4. Instantiate the user's active session document
    const attempt = await TakesTest.create({
      userId,
      testId: testConfig._id,
      status: 'in_progress',
      test: {
        _id: testConfig._id,
        name: `${testConfig.subject?.name || 'Subject'} Test`,
        startAt: new Date(),
        startEnd: new Date(Date.now() + 30 * 60000), // Standard 30 minutes duration limit
        question: questionsSnapshot
      }
    });

    // 5. Security: Strip correct answer keys from the JSON response before sending it to the frontend
    const clientSafeAttempt = attempt.toObject();
    clientSafeAttempt.test.question.forEach((q) => {
      delete q.answer;
    });

    return res.status(201).json({ 
      status: true, 
      test: clientSafeAttempt 
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: "Failed to initialize test session." });
  }
};
