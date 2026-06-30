

import ExcelJS from "exceljs";
import AttemptTest from "../../models/AttemptTest.js";
import Test from "../../models/Test.js";




export const getTestReport = async (req, res) => {
  try {
    const { testId } = req.params;

    // Fetch test name and attempts in parallel
    const [test, attempts] = await Promise.all([
      Test.findById(testId).select("name").lean(),

      AttemptTest.find({ testId })
        .populate({
          path: "userId",
          select: "rollno name branch passingyear email",
        })
        .select(
          "userId answers correctAnswers status startAt endAt"
        )
        .lean(),
    ]);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test Report");

    // ==========================
    // MAIN HEADING
    // ==========================

    worksheet.mergeCells("A1:J1");

    const titleCell = worksheet.getCell("A1");

    titleCell.value = `${test.name} - Report`;

    titleCell.font = {
      size: 18,
      bold: true,
    };

    titleCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.getRow(1).height = 30;

    // ==========================
    // COLUMN DEFINITIONS
    // ==========================

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Roll No", key: "rollno", width: 20 },
      { header: "Student Name", key: "name", width: 30 },
      { header: "Branch", key: "branch", width: 20 },
      { header: "Passing Year", key: "passingyear", width: 18 },
      { header: "Email", key: "email", width: 35 },
      { header: "Total Questions", key: "total", width: 18 },
      { header: "Attempted", key: "attempted", width: 15 },
      { header: "Not Attempted", key: "notAttempted", width: 18 },
      { header: "Correct Answers", key: "correct", width: 18 },
      { header: "Score (%)", key: "score", width: 15 },
    ];

    // Header row starts from row 3
    const headerRow = worksheet.getRow(3);

    worksheet.columns.forEach((column, index) => {
      headerRow.getCell(index + 1).value = column.header;
    });

    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" },
    };

    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // ==========================
    // DATA ROWS
    // ==========================

    attempts.forEach((attempt, index) => {
      const totalQuestions = attempt.answers?.length || 0;

      const attempted = attempt.answers.filter(
        (a) =>
          a.answer !== null &&
          a.answer !== undefined &&
          String(a.answer).trim() !== ""
      ).length;

      const notAttempted = totalQuestions - attempted;

      const correct = attempt.correctAnswers || 0;

      const score =
        totalQuestions > 0
          ? ((correct / totalQuestions) * 100).toFixed(2)
          : 0;

      worksheet.addRow({
        sno: index + 1,
        rollno: attempt.userId?.rollno || "-",
        name: attempt.userId?.name || "-",
        branch: attempt.userId?.branch || "-",
        passingyear: attempt.userId?.passingyear || "-",
        email: attempt.userId?.email || "-",
        total: totalQuestions,
        attempted,
        notAttempted,
        correct,
        score: `${score}%`,
      });
    });

    // ==========================
    // STYLE ALL CELLS
    // ==========================

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 3) {
        row.eachCell((cell) => {
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Freeze heading + header row
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 3,
      },
    ];

    // ==========================
    // DOWNLOAD RESPONSE
    // ==========================

    const fileName = `${test.name
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()}_report.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    await workbook.xlsx.write(res);

    return res.end();
  } catch (error) {
    console.error("Export Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export report",
      error: error.message,
    });
  }
};

export default getTestReport

