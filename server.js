import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import v1Route from "./routes/v1Route.js";
import v1AdminRoute from "./routes/v1AdminRoute.js";
import dbconnect from "./config/db.js";
import cookieParser from "cookie-parser";
import adminAuth from "./middlewares/adminAuth.js";
import userAuth from "./middlewares/userAuth.js";
import userRoute from "./routes/userRoute.js";
import verifyme from "./controllers/user-controller/verifyme.js";
import getQuestionEntryTemplateFile from "./controllers/admin-controller/getQuestionEntryTemplateFile.js";
import addQuestions from "./controllers/admin-controller/addQuestionsByExcelFile.js";
import { uploadExcel } from "./middlewares/multer.js";
import createTestWithQuestions from "./controllers/admin-controller/createTestWithQuestions.js";
import takeTest from "./controllers/student-controller/takeTest.js";
import getConductedTest from "./controllers/student-controller/getConductedTest.js";
import User from "./models/User.js";
import sendRegisterUserEmail from "./operations/mail/sendRegisterUserEmail.js";
import studentAnalyticsRoute from "./routes/studentAnalyticsRoute.js";
import setupSwagger from "./config/swagger.js";


const app = express();

app.use(cors({
  origin: process.env.ONLINE_URL,
  methods: ["GET", 'POST', "PUT", "DELETE"],
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Use both DB connection methods just in case one replaces the other
try {
    dbconnect();
} catch (e) {
  console.log(e)
    console.log("Using fallback mongo connection");
}

app.use('/user',userRoute)
//app.use("/api/v1", userAuth, v1Route);
//app.use("/api/admin/v1",adminAuth,v1AdminRoute)

app.use("/student",userAuth,  v1Route); 
app.use("/admin",adminAuth,v1AdminRoute)

// Mount student analytics and coding platform integration routes
app.use("/api/v1/student", userAuth, studentAnalyticsRoute);
app.use("/student", userAuth, studentAnalyticsRoute);

app.get("/verifyme", userAuth,verifyme)

// Setup Swagger API Documentation
setupSwagger(app);

/* app.get("/addsub",async(req,res)=>{
   const subject= await Subject.create({name:"Web Development"});
   res.send(subject);
  const question= await Question.insertMany(dsaMcqs)
   res.send(question[0])

})
 */





app.get("/testotp",(req,res)=>{
  const e= "SAURABHYADAV7041916@GMAIL.COM";
  const o="123"
  sendRegisterUserEmail(e,"sbh",o)
  res.send("otp is sended")
})

app.listen(process.env.PORT,'0.0.0.0', () => {
    
    
});





