import Question from "../../models/Question.js";



const updateQuetion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { questionText, options, answer, mark } = req.body;

    // Validate input
    if (!questionText || !options || !answer || !mark) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Find the question by ID and update it
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { questionText, options, answer, mark },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      updatedQuestion
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update question"
    });
  }
};

export default updateQuetion;