import Question from '../../models/Question.js'
export const addQuestion = async (req, res) => {
  try {
    const { question, options, answer, topic, subjectId, about="" } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    await Question.create({
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

export const updateQuestion = async(req,res)=>{
    try {
      const updatedMCQ =
        await MCQ.findByIdAndUpdate(
          req.params._id,
         {
            subjectId:
              req.body.subject,
            question:
              req.body.question,
            options:  req.body.options,
            answer:
              req.body.answer,
            explanation:
              req.body.explanation,
          },{
            new:true
          }
          
        );

      if (!updatedMCQ) {
        return res.status(404).json({
          message: "MCQ not found",
        });
      }

      res.json({
        message:
          "MCQ updated successfully",
        mcq: updatedMCQ,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: err.message,
      });
    }
}


export const deleteQues = async(req,res) => {
    try {
      const mcq =
        await MCQ.findById(
          req.params.id
        );

      if (!mcq) {
        return res.status(404).json({
          message:
            "MCQ not found",
        });
      }

      await MCQ.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "MCQ deleted successfully",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: err.message,
      });
    }
}





