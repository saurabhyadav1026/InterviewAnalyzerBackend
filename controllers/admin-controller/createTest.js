export const generateTest = async (req, res) => {
  try {

    const {
      name,
      startAt,
      endAt
    } = req.body;

    const questions = await Question.aggregate([
      {
        $sample: {
          size: 20
        }
      }
    ]);

    const test = await Test.create({
      name,
      startAt,
      endAt,
      questions: questions.map(q => q._id),
      createdBy: req.user._id
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