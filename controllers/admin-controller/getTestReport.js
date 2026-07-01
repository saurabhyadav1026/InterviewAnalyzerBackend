import ExcelJS from "exceljs";
import AttemptTest from "../../models/AttemptTest.js";
import Test from "../../models/Test.js";

export const getTestReport = async (req, res) => {
  try {
    const { testId } = req.params;

    const [test, attempts] = await Promise.all([
      Test.findById(testId).select("name").lean(),

      AttemptTest.find({ testId })
        .populate({
          path: "userId",
          select: "rollno name branch passingYear email"
        })
        .select(
          "userId answers correctAnswers status startAt endAt aiAnalysis"
        )
        .lean()
    ]);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test Report");

    // ================= TITLE =================

    worksheet.mergeCells("A1:L1");

    const titleCell = worksheet.getCell("A1");

    titleCell.value = `${test.name} - Report`;

    titleCell.font = {
      size: 18,
      bold: true,
      color: { argb: "FFFFFFFF" }
    };

    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1F4E78" }
    };

    titleCell.alignment = {
      horizontal: "center",
      vertical: "middle"
    };

    worksheet.getRow(1).height = 30;

    // ================= COLUMNS =================

    worksheet.columns = [
      { key: "sno", width: 10 },
      { key: "rollno", width: 20 },
      { key: "name", width: 30 },
      { key: "branch", width: 20 },
      { key: "passingyear", width: 18 },
      { key: "email", width: 35 },
      { key: "total", width: 18 },
      { key: "attempted", width: 15 },
      { key: "notAttempted", width: 18 },
      { key: "correct", width: 18 },
      { key: "score", width: 15 },
      { key: "aiAnalysis", width: 80 }
    ];

    // ================= HEADER =================

    const headerRow = worksheet.getRow(3);

    headerRow.values = [
      "S.No",
      "Roll No",
      "Student Name",
      "Branch",
      "Passing Year",
      "Email",
      "Total Questions",
      "Attempted",
      "Not Attempted",
      "Correct Answers",
      "Score (%)",
      "AI Analysis"
    ];

    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFFFF" }
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" }
    };

    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true
    };

    // ================= DATA =================

    attempts.forEach((attempt, index) => {
      const totalQuestions = attempt.answers?.length || 0;

      const attempted = attempt.answers.filter(
        a =>
          a.answer !== null &&
          a.answer !== undefined &&
          String(a.answer).trim() !== ""
      ).length;

      const notAttempted = totalQuestions - attempted;

      const correct = attempt.correctAnswers || 0;

      const score =
        totalQuestions > 0
          ? ((correct / totalQuestions) * 100).toFixed(2)
          : "0.00";

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
        aiAnalysis: attempt.aiAnalysis
          ? JSON.stringify(attempt.aiAnalysis, null, 2)
          : "-"
      });
    });

    // ================= STYLING =================

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 3) {
        row.eachCell(cell => {
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
          };
        });
      }
    });

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 3
      }
    ];

    // ================= DOWNLOAD =================

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

    res.end();
  } catch (error) {
    console.error("Export Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export report",
      error: error.message
    });
  }
};

export default getTestReport;