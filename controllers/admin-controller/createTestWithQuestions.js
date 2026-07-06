


import mongoose from "mongoose";
import Question from "../../models/Question.js";
import Test from "../../models/Test.js";
import addQuestionsForTest from "./addQuestionsForTest.js";




export const createTestWithQuestions = async (req, res) => {
  let test=null;
  try {
  

    const {
      name,
      startAt,
      endAt,
      year,
      questions_no
      
    } = req.body;



  const userId =   new mongoose.Types.ObjectId(req.userId || "6a45636102faf6e4c4c303db") ;;

     test = await Test.create({
      name,
      startAt,
      endAt,
      year,
      createdBy: userId
    });


 test.questions  =await addQuestionsForTest(req.file,test._id,questions_no);
 test.save();

    res.status(201).json({
      status: true,
      test: {
        id: test._id,
        name: test.name,
        startAt: test.startAt,
        endAt: test.endAt,
        year
      }
    });

  } catch (err) {
    if(test){
      await Test.deleteOne({_id:test.id});
    }
    console.log(err);

    res.status(500).json({
      status: false,
      message: "Failed to generate test"
    });
  }
};


export default createTestWithQuestions;



// deleted testId 6a4c1200d432279e891c69fd