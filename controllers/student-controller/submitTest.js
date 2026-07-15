

import getAiAnalysis from "../../config/ai/getAiAnalysis.js";
import AttemptTest from "../../models/AttemptTest.js";
import Question from "../../models/Question.js";
import Test from "../../models/Test.js";



const submitTest = async (req, res) => {
  try {
   
    const { attemptId, answers } = req.body;



    // Check attempt
    const attempt = await AttemptTest.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found"
      });
    }

        const test=await Test.findById(attempt.testId);
        if(test &&(!test.isActive)){
            return res.status(404).json({
                success: false,
                message: "Test is over. You cannot submit answers now."
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

 let aiAnalysis=await getAiAnalysis(JSON.stringify({questions,answers})) ;



    // Update attempt
    const updatedAttempt = await AttemptTest.findByIdAndUpdate(
      attemptId,
      {
        $set: {
          aiAnalysis,
          answers,
          correctAnswers,
          status: "submitted",
          endAt: new Date(),
          score
        }
      },
      {returnDocument: "after"  }
    );

    return res.status(200).json({
      success: true,
      message: "Test submitted successfully",
      result:  updatedAttempt,
      
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