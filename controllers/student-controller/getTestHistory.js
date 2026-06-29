import Test from "../../models/test.js";

export const getTestHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required to fetch test history",
      });
    }

    const history = await Test.find({ userid: userId }).sort({ _id: -1 });

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No test history found for this user",
      });
    }

    return res.status(200).json({
      message: "Test history retrieved successfully",
      history,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching test history",
      error: error.message,
    });
  }
};
