import mongoose from "mongoose";
import User from "../../models/User.js";
import Test from "../../models/Test.js";
import AttemptTest from "../../models/AttemptTest.js";
import Question from "../../models/Question.js";
import getAiAnalysis from "../../config/ai/getAiAnalysis.js";
import {
  fetchLeetCode,
  fetchGeeksforGeeks,
  fetchCodeforces,
  fetchHackerRank,
  fetchGitHub
} from "../../utils/platformFetcher.js";

// Helper to update the login/active day streak for a user
const updateStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastActiveDate) {
    user.dayStreak = 1;
    user.lastActiveDate = new Date();
    await user.save();
    return;
  }

  const lastActive = new Date(user.lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastActive.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.dayStreak += 1;
    user.lastActiveDate = new Date();
    await user.save();
  } else if (diffDays > 1) {
    user.dayStreak = 1;
    user.lastActiveDate = new Date();
    await user.save();
  } else if (diffDays === 0) {
    user.lastActiveDate = new Date();
    await user.save();
  }
};

// 1. GET /api/v1/student/dashboard-analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update streak on dashboard visit
    await updateStreak(user);

    // Total active tests assigned to student's year
    const totalAssignedCount = await Test.countDocuments({
      isActive: true,
      year: req.year
    });

    // Total completed/submitted attempts by this user
    const completedCount = await AttemptTest.countDocuments({
      userId: req.userId,
      status: "submitted"
    });

    // Fetch all submitted attempts to compute average score % and skill strengths
    const submittedAttempts = await AttemptTest.find({
      userId: req.userId,
      status: "submitted"
    }).populate("testId");

    let totalPct = 0;
    let validAttemptsCount = 0;

    const categories = ["Aptitude", "DSA", "Web Dev", "Problem Solving"];
    const catAccuracy = {};
    categories.forEach((cat) => {
      catAccuracy[cat] = { correct: 0, total: 0 };
    });

    submittedAttempts.forEach((att) => {
      const totalQ = att.answers?.length || att.testId?.questions?.length || 0;
      const correct = att.correctAnswers || 0;

      if (totalQ > 0) {
        totalPct += (correct / totalQ) * 100;
        validAttemptsCount++;
      }

      const cat = att.category || att.testId?.category;
      if (cat && categories.includes(cat)) {
        catAccuracy[cat].correct += correct;
        catAccuracy[cat].total += totalQ;
      }
    });

    const averageScorePercent =
      validAttemptsCount > 0 ? parseFloat((totalPct / validAttemptsCount).toFixed(2)) : 0;

    const categorySkillStrength = {};
    categories.forEach((cat) => {
      const item = catAccuracy[cat];
      categorySkillStrength[cat] =
        item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });

    return res.status(200).json({
      success: true,
      totalAssignedCount,
      completedCount,
      averageScorePercent,
      streak: user.dayStreak,
      totalScore: user.totalScore,
      categorySkillStrength
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. POST /api/v1/student/connect-platform
export const connectPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;
    const validPlatforms = ["leetcode", "gfg", "codeforces", "hackerrank", "github"];

    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}`
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const platformData = user.connectedPlatforms?.[platform] || { username: "", isLocked: false };

    // Disconnection or change request is rejected if already locked
    if (platformData.isLocked) {
      return res.status(400).json({
        success: false,
        message: `Disconnection or handle change is disabled for ${platform} once it is locked.`
      });
    }

    if (username && username.trim() !== "") {
      user.connectedPlatforms[platform] = {
        username: username.trim(),
        connectedAt: new Date(),
        isLocked: true // Locked permanently on connection
      };
    } else {
      // Disconnection (only possible if not locked, which we verified above)
      user.connectedPlatforms[platform] = {
        username: "",
        connectedAt: null,
        isLocked: false
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Updated platform connection for ${platform} successfully.`,
      connectedPlatforms: user.connectedPlatforms
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. GET /api/v1/student/platform-analytics
export const getPlatformAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const analytics = {};
    let totalPlatformPoints = 0;

    // LeetCode: 10 points per solved question
    if (user.connectedPlatforms?.leetcode?.username) {
      const stats = await fetchLeetCode(user.connectedPlatforms.leetcode.username);
      const points = (stats.solvedCount || 0) * 10;
      analytics.leetcode = {
        username: user.connectedPlatforms.leetcode.username,
        solvedCount: stats.solvedCount || 0,
        easyCount: stats.easyCount || 0,
        mediumCount: stats.mediumCount || 0,
        hardCount: stats.hardCount || 0,
        points
      };
      totalPlatformPoints += points;
    } else {
      analytics.leetcode = null;
    }

    // GeeksforGeeks: 10 points per completed question
    if (user.connectedPlatforms?.gfg?.username) {
      const stats = await fetchGeeksforGeeks(user.connectedPlatforms.gfg.username);
      const points = (stats.solvedCount || 0) * 10;
      analytics.gfg = {
        username: user.connectedPlatforms.gfg.username,
        solvedCount: stats.solvedCount || 0,
        codingScore: stats.codingScore || 0,
        points
      };
      totalPlatformPoints += points;
    } else {
      analytics.gfg = null;
    }

    // Codeforces: 15 points per solved problem
    if (user.connectedPlatforms?.codeforces?.username) {
      const stats = await fetchCodeforces(user.connectedPlatforms.codeforces.username);
      const points = (stats.solvedCount || 0) * 15;
      analytics.codeforces = {
        username: user.connectedPlatforms.codeforces.username,
        solvedCount: stats.solvedCount || 0,
        rating: stats.rating || 0,
        points
      };
      totalPlatformPoints += points;
    } else {
      analytics.codeforces = null;
    }

    // HackerRank: 10 points per solved challenge
    if (user.connectedPlatforms?.hackerrank?.username) {
      const stats = await fetchHackerRank(user.connectedPlatforms.hackerrank.username);
      const points = (stats.solvedCount || 0) * 10;
      analytics.hackerrank = {
        username: user.connectedPlatforms.hackerrank.username,
        solvedCount: stats.solvedCount || 0,
        badgeCount: stats.badgeCount || 0,
        points
      };
      totalPlatformPoints += points;
    } else {
      analytics.hackerrank = null;
    }

    // GitHub: Portfolio Tracking (0 points)
    if (user.connectedPlatforms?.github?.username) {
      const stats = await fetchGitHub(user.connectedPlatforms.github.username);
      analytics.github = {
        username: user.connectedPlatforms.github.username,
        repoCount: stats.repoCount || 0,
        profileLink: stats.profileLink || `https://github.com/${user.connectedPlatforms.github.username}`,
        points: 0
      };
    } else {
      analytics.github = null;
    }

    // Recalculate totalScore (Test Scores + Live Coding Platform Points)
    const attempts = await AttemptTest.find({ userId: req.userId, status: "submitted" });
    const totalTestScore = attempts.reduce((sum, att) => sum + (att.score || 0), 0);
    const totalScore = totalTestScore + totalPlatformPoints;

    user.totalScore = totalScore;
    await user.save();

    return res.status(200).json({
      success: true,
      platformAnalytics: analytics,
      totalPlatformPoints,
      totalScore
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. GET /api/v1/student/getConductedTest
export const getConductedTest = async (req, res) => {
  try {
    const tests = await Test.aggregate([
      {
        $match: { isActive: true, year: req.year }
      },
      {
        $lookup: {
          from: "questions",
          localField: "questions.question",
          foreignField: "_id",
          as: "questionDocs"
        }
      },
      {
        $addFields: {
          totalQuestions: { $size: "$questions" },
          totalMarks: { $sum: "$questionDocs.mark" }
        }
      },
      {
        $project: {
          questions: 0,
          questionDocs: 0
        }
      },
      {
        $sort: { createdAt: -1 } // latest upload time first
      }
    ]);

    return res.status(200).json({
      success: true,
      tests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 5. GET /api/v1/student/getTest/:testId
export const getTestDetails = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await Test.findOne({
      _id: testId,
      isActive: true,
      year: req.year
    }).populate({
      path: "questions.question",
      select: "-answer" // omit correct answer key for security during taking
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or is currently inactive."
      });
    }

    // Initialize or load existing AttemptTest
    let attempt = await AttemptTest.findOne({ testId, userId: req.userId });
    if (!attempt) {
      attempt = await AttemptTest.create({
        userId: req.userId,
        testId,
        status: "in_progress",
        category: test.category || "DSA",
        startAt: new Date()
      });
    }

    const timerDetails = {
      durationMinutes: test.durationMinutes || 0,
      startAt: test.startAt,
      endAt: test.endAt,
      serverTime: new Date()
    };

    return res.status(200).json({
      success: true,
      test,
      attemptId: attempt._id,
      timerDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 6. POST /api/v1/student/submitTest
export const submitTest = async (req, res) => {
  try {
    const { attemptId, testId, answers } = req.body;

    let attempt;
    if (attemptId) {
      attempt = await AttemptTest.findById(attemptId);
    } else if (testId) {
      attempt = await AttemptTest.findOne({
        testId,
        userId: req.userId,
        status: "in_progress"
      });
    }

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt session not found."
      });
    }

    const test = await Test.findById(attempt.testId);
    if (test && !test.isActive) {
      return res.status(400).json({
        success: false,
        message: "Test period has ended. You cannot submit answers now."
      });
    }

    // Check correctness
    const questionIds = answers.map((ans) => ans.question);
    const questions = await Question.find({
      _id: { $in: questionIds }
    }).select("_id answer mark");

    const questionMap = new Map();
    questions.forEach((q) => {
      questionMap.set(q._id.toString(), {
        answer: q.answer,
        mark: q.mark
      });
    });

    let correctAnswers = 0;
    let score = 0;

    const evaluatedAnswers = answers.map((ans) => {
      const qInfo = questionMap.get(ans.question.toString());
      const isCorrect = qInfo
        ? ans.answer && ans.answer.trim() === qInfo.answer.trim()
        : false;

      if (isCorrect) {
        correctAnswers++;
        score += qInfo.mark;
      }

      return {
        question: ans.question,
        answer: ans.answer,
        isCorrect
      };
    });

    let aiAnalysis = "Failed to load Ai-Analysis report.";
    try {
      aiAnalysis = await getAiAnalysis(JSON.stringify({ questions, answers }));
    } catch (e) {
      console.error("AI Analysis failed:", e.message);
    }

    const updatedAttempt = await AttemptTest.findByIdAndUpdate(
      attempt._id,
      {
        $set: {
          aiAnalysis,
          answers: evaluatedAnswers,
          correctAnswers,
          status: "submitted",
          endAt: new Date(),
          score,
          category: test?.category || "DSA"
        }
      },
      { new: true }
    );

    // Recalculate and update student's User.totalScore
    const user = await User.findById(req.userId);
    if (user) {
      const userAttempts = await AttemptTest.find({ userId: req.userId, status: "submitted" });
      const totalTestScore = userAttempts.reduce((sum, att) => sum + (att.score || 0), 0);

      // Extract coding platform points from current score
      const oldTestScore = userAttempts
        .filter((att) => att._id.toString() !== attempt._id.toString())
        .reduce((sum, att) => sum + (att.score || 0), 0);
      const platformPoints = Math.max(0, user.totalScore - oldTestScore);

      user.totalScore = totalTestScore + platformPoints;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Test submitted successfully.",
      result: updatedAttempt,
      totalScore: score,
      correctCount: correctAnswers,
      detailedAnswerEvaluation: {
        answers: evaluatedAnswers,
        aiAnalysis
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 7. GET /api/v1/student/test-history
export const getTestHistory = async (req, res) => {
  try {
    const attempts = await AttemptTest.find({
      userId: req.userId,
      status: "submitted"
    })
      .populate("testId")
      .sort({ endAt: -1 });

    const history = attempts.map((att) => {
      const totalQ = att.answers?.length || att.testId?.questions?.length || 0;
      const correct = att.correctAnswers || 0;
      const accuracy = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;

      let duration = 0;
      if (att.startAt && att.endAt) {
        duration = Math.round((att.endAt - att.startAt) / 1000 / 60); // minutes
      }

      return {
        attemptId: att._id,
        testName: att.testId?.name || "Deleted Test",
        category: att.category || att.testId?.category || "DSA",
        date: att.endAt || att.updatedAt,
        score: att.score,
        accuracy,
        duration
      };
    });

    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
