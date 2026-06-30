import Question from '../../models/Question.js'
export const addQuestion = async (req, res) => {
  try {
    const { question, options, answer, topic="", subjectId, about="" } = req.body;

    

    const existingQuestion = await Question.findOne({ question });

    if (existingQuestion) {
      return res.status(400).json({
        message: "Question already exists"
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
        await Question.findByIdAndUpdate(
          req.params._id,
         {
            question:
              req.body.question,
            options:  req.body.options,
            answer:
              req.body.answer,
            topic:
              req.body.topic,
            subjectId:
              req.body.subjectId,
            about:
              req.body.about    
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
        await Question.findById(
          req.params.id
        );

      if (!mcq) {
        return res.status(404).json({
          message:
            "MCQ not found",
        });
      }

      await Question.findByIdAndDelete(
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





