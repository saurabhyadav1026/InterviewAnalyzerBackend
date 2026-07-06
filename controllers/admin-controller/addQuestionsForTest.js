import ExcelJS from "exceljs";
import Question from "../../models/Question.js";










export const addQuestionsForTest = async (file,testId,questions_no) => {
    try {
        if (!file && !testId) {
            return res.status(400).json({
                success: false,
                message: "Please upload an Excel file."
            });
        }


        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(file.buffer);

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
               testId,
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
                mark: Number(mark) || 2            });
        });

        if (questionsToInsert.length === 0) {
            return new Error("Empty question file.")
        
        }

        const insertedQuestions = await Question.insertMany(
            questionsToInsert,
            {
                ordered: false // continues even if some rows fail
            }
        );

        return  insertedQuestions.map((q)=>{ return {question:q._id}}).slice(0,questions_no)    

    } catch (error) {
        console.error(error);

       return  new Error("questions not be added.")
    }
};


export default addQuestionsForTest;