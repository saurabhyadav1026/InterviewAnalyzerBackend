import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcel = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log("file received:  ", file);
        if (
            file.mimetype ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.originalname.endsWith(".xlsx")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only .xlsx files are allowed"));
        }

        console.log("file received:  ", file);
    }
});