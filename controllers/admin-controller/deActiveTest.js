import Test from "../../models/Test.js";


const deActiveTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    test.isActive = false;
    await test.save();

    return res.status(200).json({
      success: true,
      message: "Test deactivated successfully"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to deactivate test"
    });
  }
};

export default deActiveTest;