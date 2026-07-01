import mongoose from "mongoose";
import Question from "../../models/Question.js";
import Test from "../../models/Test.js";




export const createTest = async (req, res) => {
  try {
    console.log("we will create test")

    const {
      name="test1",
      startAt=Date.now(),
      endAt=Date.now(),
      questions_no=10
    } = req.query;

    const questions = await Question.aggregate([
      {
        $sample: {
          size: questions_no
        }
      }
    ]);
    let userId = new mongoose.Types.ObjectId(req.userId)  //||"6a434c2a8fc788660ccc763b") ;

    const test = await Test.create({
      name,
      startAt,
      endAt,
      questions: questions.map(q => { return {question:q._id}}),
      createdBy: userId
    });

    res.status(201).json({
      status: true,
      test: {
        id: test._id,
        name: test.name,
        startAt: test.startAt,
        endAt: test.endAt
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: false,
      message: "Failed to generate test"
    });
  }
};