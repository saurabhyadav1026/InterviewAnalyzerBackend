import Test from "../../models/Test.js";

const getTestHistory = async (req, res) => {
  try {
    
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required to fetch test history",
      });
    }

    const history = await Test.find({ userId: userId }).sort({ _id: -1 });

    if (!history || history.length === 0) {
      return res.status(200).json({
        history:[],
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


export default getTestHistory;