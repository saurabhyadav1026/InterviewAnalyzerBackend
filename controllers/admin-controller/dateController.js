import test from "../models/Test.js";

export const getTotalSolvedQuestions = async (req, res) => {
  try {
    const { startfrom, fromto } = req.query;

    if (!startfrom || !fromto) {
      return res.status(400).json({
        success: false,
        message: "startfrom and fromto are required",
      });
    }

    const startDate = new Date(startfrom);
    const endDate = new Date(fromto);
    endDate.setHours(23, 59, 59, 999);

    const totalSolved = await test.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return res.status(200).json({
      success: true,
      totalSolved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};