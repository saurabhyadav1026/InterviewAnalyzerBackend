import Question from '../models/questionModel.js'

export const addMCQ = async (req, res) => {
  try {
    const { questionId, question, options, answer, topic, subjectId, about } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    await Question.create({
      questionId,
      question,
      options,
      answer,
      topic,
      subjectId,
      about
    });

    res.status(201).json({
      message: "Question added successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const updateQues = async(req,res)=>{
    res.send("processed")
}



