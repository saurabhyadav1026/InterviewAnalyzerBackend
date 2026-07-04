import Test from "../../models/Test.js";



const changeTestSchedule = async (req, res) => {
  try {
    const { testId } = req.params;
    const { newStartTime, newEndTime } = req.body;

    // Validate input
    if (!newStartTime || !newEndTime) {
      return res.status(400).json({
        success: false,
        message: "New start time and end time are required"
      });
    }

    // Find the test by ID
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    // Update the test schedule
    test.startTime = new Date(newStartTime);
    test.endTime = new Date(newEndTime);
    await test.save();

    return res.status(200).json({
      success: true,
      message: "Test schedule updated successfully",
      test
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update test schedule"
    });
  }
};

export default changeTestSchedule;
