

import AttemptTest from "../../models/AttemptTest.js";
import Question from "../../models/Question.js";



const submitTest = async (req, res) => {
  try {
    console.log(req)
    console.log(req.headders)
    console.log(req.body)
    const { attemptId, answers } = req.body;

    // Check attempt
    const attempt = await AttemptTest.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found"
      });
    }

    // Get all questions submitted by user
    const questionIds = answers.map(ans => ans.question);

    const questions = await Question.find({
      _id: { $in: questionIds }
    }).select("_id answer mark");

    // Create lookup map
    const questionMap = new Map();

    questions.forEach(question => {
      questionMap.set(question._id.toString(), {
        answer: question.answer,
        mark: question.mark
      });
    });

    let correctAnswers = 0;
    let score = 0;

    // Evaluate answers
    for (const submittedAnswer of answers) {
      const question = questionMap.get(
        submittedAnswer.question.toString()
      );

      if (!question) continue;

      if (
        submittedAnswer.answer &&
        submittedAnswer.answer.trim() === question.answer.trim()
      ) {
        correctAnswers++;
        score += question.mark;
      }
    }

    // Update attempt
    const updatedAttempt = await AttemptTest.findByIdAndUpdate(
      attemptId,
      {
        $set: {
          answers,
          correctAnswers,
          status: "submitted",
          endAt: new Date(),

          // save score only if you add this field in schema
          // score
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Test submitted successfully",
      data: {
        attempt: updatedAttempt,
        score,
        correctAnswers
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




export default submitTest;