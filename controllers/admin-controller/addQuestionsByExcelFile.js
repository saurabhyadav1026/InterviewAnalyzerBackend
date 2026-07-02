import ExcelJS from "exceljs";
import Question from "../../models/Question.js";

export const addQuestionsByExcelFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an Excel file."
            });
        }

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.getWorksheet("Questions");

        if (!worksheet) {
            return res.status(400).json({
                success: false,
                message: "Questions sheet not found."
            });
        }

        const questionsToInsert = [];

        worksheet.eachRow((row, rowNumber) => {
            // Skip header row
            if (rowNumber === 1) return;

            const question = row.getCell(1).value;
            const questionImage = row.getCell(2).value;
            const option1 = row.getCell(3).value;
            const option2 = row.getCell(4).value;
            const option3 = row.getCell(5).value;
            const option4 = row.getCell(6).value;
            const answer = row.getCell(7).value;
            const level = row.getCell(8).value;
            const topic = row.getCell(9).value;
            const subject = row.getCell(10).value;
            const about = row.getCell(11).value;
            const mark = row.getCell(12).value;

            // Skip completely empty rows
            if (
                !question &&
                !option1 &&
                !option2 &&
                !option3 &&
                !option4
            ) {
                return;
            }

            questionsToInsert.push({
                question: question?.toString().trim(),
                questionImage: questionImage?.toString().trim() || "",
                options: [
                    option1?.toString().trim(),
                    option2?.toString().trim(),
                    option3?.toString().trim(),
                    option4?.toString().trim()
                ],
                answer: answer?.toString().trim(),
                 level: level?.toString().trim(),
                topic: topic?.toString().trim(),
                subject: subject?.toString().trim(),
                about: about?.toString().trim() || "",
                mark: Number(mark) || 1
            });
        });

        if (questionsToInsert.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid questions found in file."
            });
        }

        const insertedQuestions = await Question.insertMany(
            questionsToInsert,
            {
                ordered: false // continues even if some rows fail
            }
        );

        return res.status(201).json({
            success: true,
            message: `${insertedQuestions.length} questions imported successfully.`,
            totalImported: insertedQuestions.length
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export default addQuestionsByExcelFile;