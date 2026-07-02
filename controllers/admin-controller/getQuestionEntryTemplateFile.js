import ExcelJS from "exceljs";
import Question from "../../models/Question.js";

export const getQuestionEntryTemplateFile = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();

        // Main worksheet
        const worksheet = workbook.addWorksheet("Questions");

        // Hidden worksheet for dropdown values
        const enumSheet = workbook.addWorksheet("Enums");

        // Get enum values from mongoose schema
        const subjects = Question.schema.path("subject").enumValues;



        console.log("Subjects:", subjects);

        if (!subjects || subjects.length === 0) {
            throw new Error("No subject enum values found in schema.");
        }

        // Define columns
        worksheet.columns = [
            { header: "Question", key: "question", width: 40 },             
            { header: "Question Image", key: "questionImage", width: 30 },
            { header: "Option 1", key: "option1", width: 20 },
            { header: "Option 2", key: "option2", width: 20 },
            { header: "Option 3", key: "option3", width: 20 },
            { header: "Option 4", key: "option4", width: 20 },
            { header: "Answer", key: "answer", width: 20 },
            { header: "Level", key: "level", width: 20 },
            { header: "Topic", key: "topic", width: 20 },
            { header: "Subject", key: "subject", width: 25 },
            { header: "About", key: "about", width: 30 },
            { header: "Mark", key: "mark", width: 10 }
        ];

        // Add enum values to hidden sheet      for subject column
        subjects.forEach((subject, index) => {
            enumSheet.getCell(`A${index + 1}`).value = subject;
        });

        // Apply dropdown validation on Subject column (I)
        for (let row = 2; row <= 1000; row++) {
            worksheet.getCell(`J${row}`).dataValidation = {
                type: "list",
                allowBlank: false,
                showInputMessage: true,
                promptTitle: "Subject",
                showErrorMessage: true,
                errorTitle: "Invalid Subject",
                error: "Please select a valid subject.",
                formulae: [`=Enums!$A$1:$A$${subjects.length}`]
            };
        }



 // Add enum values to hidden sheet         for level column
        const levels = Question.schema.path("level").enumValues;
        levels.forEach((level, index) => {
            enumSheet.getCell(`B${index + 1}`).value = level;
        });

        // Apply dropdown validation on Subject column (I)
        for (let row = 2; row <= 1000; row++) {
            worksheet.getCell(`H${row}`).dataValidation = {
                type: "list",
                allowBlank: false,
                showInputMessage: true,
                promptTitle: "Level",
                showErrorMessage: true,
                errorTitle: "Invalid Subject",
                error: "Please select a valid subject.",
                formulae: [`=Enums!$B$1:$B$${levels.length}`]
            };
        }



        // Header styling
        const headerRow = worksheet.getRow(1);

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
            vertical: "middle",
            horizontal: "center"
        };

        // Freeze header row
        worksheet.views = [
            {
                state: "frozen",
                ySplit: 1
            }
        ];

        // Hide enum sheet
        enumSheet.state = "hidden";

        // Set response headers
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="question-template.xlsx"'
        );

        // Send file
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Template generation error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default getQuestionEntryTemplateFile;