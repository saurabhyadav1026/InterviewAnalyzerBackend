# InterviewAnalyzer Backend Documentation

## 1. Project Overview

InterviewAnalyzer is a Node.js and Express backend for an online test and interview-preparation platform. The current backend supports student registration with email OTP verification, password and Google login, protected student test flows, admin-created conducted tests, Excel-based question upload, Excel report export, feedback capture, and AI-generated answer analysis.

The backend uses MongoDB with Mongoose, JWT authentication stored in HTTP-only cookies, bcrypt password hashing, Gmail SMTP through Nodemailer, ExcelJS for spreadsheet import/export, Multer for upload handling, and Azure OpenAI through the `openai` SDK.

## 2. Current Core Features

- Student registration with OTP email verification.
- Login with email/password and cookie-based JWT session.
- Login and registration entry points for Google ID token authentication.
- Password reset link generation by email.
- Authenticated session verification through `/verifyme`.
- Student listing of active conducted tests filtered by year.
- Student test start/resume with one attempt per user per test.
- Student answer submission with score calculation and AI analysis.
- Student feedback submission.
- Admin test creation from uploaded Excel question files.
- Admin question-entry template download.
- Admin conducted-test listing.
- Admin test report export as `.xlsx`.

## 3. Technology Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express |
| Module System | ES modules |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcryptjs |
| Session Storage | HTTP-only cookies |
| File Upload | multer memory storage |
| Excel Import/Export | exceljs |
| Mail | nodemailer with Gmail SMTP |
| Google Auth | google-auth-library |
| AI Integration | Azure OpenAI via `openai` SDK |
| Environment Config | dotenv |
| CORS | cors |

## 4. Project Structure

```text
InterviewAnalyzer/
|-- server.js
|-- package.json
|-- BACKEND_DOCUMENTATION.md
|-- config/
|   |-- db.js
|   |-- ai/
|   |   |-- ai_config.js
|   |   |-- ai_instruction.js
|   |   |-- ai_instruction1.js
|   |   `-- getAiAnalysis.js
|   `-- mail/sender.js
|-- controllers/
|   |-- feedbackController.js
|   |-- user-controller/
|   |-- student-controller/
|   `-- admin-controller/
|-- middlewares/
|   |-- adminAuth.js
|   |-- multer.js
|   `-- userAuth.js
|-- models/
|   |-- AttemptTest.js
|   |-- Feedback.js
|   |-- Otp.js
|   |-- PraticeTest.js
|   |-- Question.js
|   |-- Student.js
|   |-- Subject.js
|   |-- Test.js
|   `-- User.js
|-- operations/
|   |-- getAndSaveOtp.js
|   `-- mail/
`-- routes/
    |-- userRoute.js
    |-- v1Route.js
    `-- v1AdminRoute.js
```

## 5. Application Entry Point

File: `server.js`

The server loads environment variables, creates the Express app, enables CORS for `ONLINE_URL`, parses cookies and request bodies, connects to MongoDB, mounts the route groups, and starts on `process.env.PORT` at host `0.0.0.0`.

Current route mounting:

| Base Path | Middleware | Purpose |
| --- | --- | --- |
| `/user` | None | Registration, login, logout, OTP, password reset, Google auth |
| `/student` | `userAuth` | Student test and feedback APIs |
| `/admin` | `adminAuth` | Admin test, Excel, and report APIs |
| `/verifyme` | `userAuth` | Validate current logged-in session |

Legacy mounts for `/api/v1` and `/api/admin/v1` are commented out and are not active.

## 6. Environment Variables

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `ONLINE_URL` | Frontend origin allowed by CORS and used in password reset links |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI resource endpoint |
| `AZURE_OPENAI_DEPLOYMENT` | Azure OpenAI deployment/model name |
| `AZURE_OPENAI_API_VERSION` | Azure OpenAI API version |
| `MAIL_USER` | Gmail SMTP sender address |
| `MAIL_PASS` | Gmail SMTP password or app password |
| `GOOGLE_O_AUTH_CLINT_ID` | Google OAuth client ID used to verify ID tokens |

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster-url/dbname
JWT_SECRET=your_strong_secret
ONLINE_URL=http://localhost:5173
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
AZURE_OPENAI_API_VERSION=2024-xx-xx
MAIL_USER=your_sender@gmail.com
MAIL_PASS=your_gmail_app_password
GOOGLE_O_AUTH_CLINT_ID=your_google_oauth_client_id
```

## 7. Data Models

### User

File: `models/User.js`

| Field | Type | Notes |
| --- | --- | --- |
| `rollno` | String | Required, unique |
| `name` | String | Required, trimmed |
| `branch` | String | Required, trimmed |
| `year` | Number | Required, enum `1`, `2`, `3`, `4` |
| `passingYear` | Number | Required |
| `email` | String | Required, lowercased, trimmed |
| `password` | String | Required, hashed before save |
| `role` | String | Enum `user`, `admin`; default `user` |
| `createdAt`, `updatedAt` | Date | Added by timestamps |

Passwords are hashed with bcrypt salt rounds of `10` in a pre-save hook.

### Test

File: `models/Test.js`

Represents an admin-created conducted test.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required |
| `year` | Number | Enum `1`, `2`, `3`, `4` |
| `questions` | Array | Items contain `question` reference to `Question` |
| `startAt` | Date | Required |
| `endAt` | Date | Required |
| `createdBy` | ObjectId | Reference to `User` |
| `isActive` | Boolean | Default `true` |

### Question

File: `models/Question.js`

| Field | Type | Notes |
| --- | --- | --- |
| `testId` | ObjectId | Reference to `Test`; default `null` |
| `question` | String | Required |
| `questionImage` | String | Optional |
| `options` | String array | Required values |
| `answer` | String | Required correct answer |
| `topic` | String | Required |
| `subject` | String | Enum `dsa`, `aptitude`, `programming`, `generalKnowledge`; default `dsa` |
| `level` | String | Enum `easy`, `medium`, `hard`; current default is `dsa` |
| `about` | String | Optional description |
| `mark` | Number | Default `2` |

### AttemptTest

File: `models/AttemptTest.js`

Represents a student's attempt for one conducted test.

| Field | Type | Notes |
| --- | --- | --- |
| `startAt` | Date | Default `Date.now` |
| `endAt` | Date | Default `null` |
| `userId` | ObjectId | Reference to `User`, required |
| `testId` | ObjectId | Reference to `Test`, required |
| `status` | String | Enum `in_progress`, `submitted`; default `in_progress` |
| `answers` | Array | Question reference and selected answer |
| `correctAnswers` | Number | Default `null` |
| `score` | Number | Default `0` |
| `aiAnalysis` | String | AI response text; default `null` |

A unique compound index on `{ userId: 1, testId: 1 }` enforces one attempt per user per test.

### Otp

File: `models/Otp.js`

Stores registration OTPs with automatic expiry.

| Field | Type | Notes |
| --- | --- | --- |
| `email` | String | Required, lowercased, trimmed |
| `otp` | String | Required hashed OTP |
| `attempts` | Number | Default `0` |
| `expiresAt` | Date | Required, TTL index with `expires: 0` |

### Feedback

File: `models/Feedback.js`

| Field | Type | Notes |
| --- | --- | --- |
| `userId` | ObjectId | Reference to `User`, required |
| `comments` | String | Required |
| `rating` | Number | Enum `1` through `10`, default `1` |

### Legacy or Currently Unmounted Models

- `PraticeTest.js` supports the older randomized practice-test flow.
- `Subject.js` supports the older subject-based practice-test flow.
- `Student.js` is separate from `User.js` and is not used by the active route flow.

## 8. Authentication and Authorization

Successful password or Google login signs a JWT with `userId`, `role`, and `year`. The token expires in `30d` and is stored in the `refreshToken` cookie with `httpOnly: true`, `secure: true`, `sameSite: "None"`, and a 30-day `maxAge`.

`middlewares/userAuth.js` reads `refreshToken`, verifies it with `JWT_SECRET`, fetches the user by `decoded.userId`, attaches `req.userId` and `req.role`, and attaches `req.year = user.year` for non-admin users.

`middlewares/adminAuth.js` reads and verifies the same cookie, fetches the user, and allows the request only when `user.role === "admin"`.

Known implementation detail: `adminAuth` currently sets `req.userId = user.userId`, but the loaded document uses `_id`. Admin test creation has a fallback ObjectId if `req.userId` is missing.

## 9. Public User API

Base path: `/user`

### Register

```http
POST /user/register
```

Request body:

```json
{
  "rollno": "CS001",
  "name": "Student Name",
  "branch": "CSE",
  "passingYear": 2027,
  "year": 2,
  "email": "student@example.com",
  "password": "password123"
}
```

Behavior:

- Validates required fields.
- Checks duplicate `email` or `rollno`.
- Generates a six-digit OTP.
- Stores the hashed OTP in MongoDB with a five-minute TTL.
- Stores pending user data in an `otpToken` HTTP-only cookie for five minutes.
- Sends the OTP email.

### Verify OTP

```http
POST /user/verifyotp
```

Request body:

```json
{
  "otp": "123456"
}
```

Expected behavior: read `otpToken`, verify the pending user payload, compare the submitted OTP with the stored hashed OTP, create the user, and clear `otpToken`.

Known issue: the current controller references missing imports (`jwt`, `bcrypt`) and mismatched variable names (`otpDoc`, `otpHash`) while the model/controller use `_otp.otp`. This route is mounted but needs correction before it can work reliably.

### Login

```http
POST /user/login
```

Request body:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Behavior: lowercases the submitted email, looks up a user by email or roll number, compares the password with bcrypt, sets the `refreshToken` cookie, and returns profile fields.

Known issue: the login query checks `rollNo`, while `User.js` defines `rollno`.

### Logout

```http
GET /user/logout
```

Clears the `refreshToken` cookie and returns a logout success message.

### Request Password Reset

```http
GET /user/resetmypassword?email=student@example.com
```

Finds the user by email, creates a five-minute reset JWT, and emails a reset link built from `ONLINE_URL`.

### Reset Password

```http
POST /user/secure/resetpassword
```

Request body:

```json
{
  "token": "password-reset-token",
  "password": "newPassword123"
}
```

Verifies the reset token, hashes the new password, and updates the user's password.

### Register With Google

```http
POST /user/registerwithgoogle
```

Request body includes a Google ID token plus the same local registration fields used by `/user/register`.

Behavior: verifies the Google ID token, checks that the Google email matches the submitted email, checks duplicate email/roll number, and creates a local user.

Known issue: the controller constructs `user_` but calls `User.create(user)`, where `user` is the earlier lookup result. This should be `User.create(user_)`.

### Login With Google

```http
POST /user/loginwithgoogle
```

Request body:

```json
{
  "token": "google-id-token"
}
```

Verifies the Google ID token, finds the local user by Google email, and reuses the normal login response and cookie setup.

## 10. Session Verification API

```http
GET /verifyme
```

Middleware: `userAuth`

Expected behavior: confirms the `refreshToken` cookie is valid and returns the logged-in user's profile fields.

Known issue: `verifyme.js` calls `User.findById(req.userId)` without `await`, so the response currently reads fields from a query object instead of a resolved user document.

## 11. Student API

Base path: `/student`

All routes use `userAuth`.

### Get Conducted Tests

```http
GET /student/getConductedTest
```

Fetches active tests for the authenticated user's `year`, joins question documents, adds `totalQuestions` and `totalMarks`, and excludes the full question arrays.

### Get or Start Test Attempt

```http
GET /student/getTest/:testId
```

Checks the test is active, finds or creates an `AttemptTest`, loads the active test for the student's year, populates questions without exposing `answer`, and returns `test` plus `attemptId`.

Known issue: the initial availability check uses `Test.find(...)`, which returns an array. An empty array is truthy, so the unavailable-test check does not catch missing tests.

### Submit Test

```http
POST /student/submitTest
```

Request body:

```json
{
  "attemptId": "attempt-id",
  "answers": [
    {
      "question": "question-id",
      "answer": "Selected Option"
    }
  ]
}
```

Behavior:

- Loads the attempt.
- Rejects submission if the linked test is inactive.
- Loads correct answers and marks for submitted question IDs.
- Counts correct answers and calculates score.
- Sends answer data to Azure OpenAI.
- Updates the attempt with answers, score, correct count, status `submitted`, `endAt`, and AI analysis.

### Submit Feedback

```http
POST /student/feedback
```

Request body:

```json
{
  "comments": "Good test experience",
  "rating": 8
}
```

Requires non-empty comments and stores feedback against `req.userId`. Rating must be between `1` and `10`.

## 12. Admin API

Base path: `/admin`

All routes use `adminAuth`.

### Download Question Entry Template

```http
GET /admin/getQuestionEntryTemplateFile
```

Builds and returns `question-template.xlsx` with a `Questions` sheet and hidden enum dropdown sheet.

Template columns:

| Column | Header |
| --- | --- |
| A | Question |
| B | Question Image |
| C | Option 1 |
| D | Option 2 |
| E | Option 3 |
| F | Option 4 |
| G | Answer |
| H | Level |
| I | Topic |
| J | Subject |
| K | About |
| L | Mark |

### Generate Test From Excel

```http
POST /admin/generateTest
```

Content type: `multipart/form-data`

| Field | Type | Notes |
| --- | --- | --- |
| `file` | File | `.xlsx` only; handled by `uploadExcel.single("file")` |
| `name` | String | Test name |
| `startAt` | Date string | Test start date/time |
| `endAt` | Date string | Test end date/time |
| `year` | Number | Target student year |
| `questions_no` | Number | Number of inserted questions to attach to the test |

Behavior: creates a `Test`, reads the uploaded workbook from memory, requires a `Questions` worksheet, inserts question rows, attaches up to `questions_no` question IDs to the test, and deletes the test if import fails after test creation.

Known issue: `addQuestionsForTest` references `res` in validation branches even though `res` is not passed into the helper.

### Get Conducted Tests

```http
GET /admin/getConductedTest
```

Fetches all tests, joins question documents, adds `totalQuestions` and `totalMarks`, and excludes full question arrays.

### Export Test Report

```http
GET /admin/checkResult/:testId
```

Loads the test and all attempts, populates user details, creates an Excel report with attempted, not-attempted, correct-answer, score, status, and AI analysis columns, then returns a generated `.xlsx` file.

## 13. Excel Upload Rules

Upload middleware: `middlewares/multer.js`

- Uses Multer memory storage.
- Accepts files with MIME type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` or names ending in `.xlsx`.
- Rejects other file types with `Only .xlsx files are allowed`.

Question import helper: `controllers/admin-controller/addQuestionsForTest.js`

- Reads workbook buffer with ExcelJS.
- Uses worksheet named `Questions`.
- Skips the first row as a header.
- Skips rows missing question and option values.
- Inserts questions with `ordered: false`.
- Returns question references as `{ "question": "question-id" }` objects.

## 14. AI Analysis

Files:

- `config/ai/ai_config.js`
- `config/ai/ai_instruction.js`
- `config/ai/getAiAnalysis.js`
- `controllers/student-controller/submitTest.js`

The OpenAI client is configured for Azure OpenAI using `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`, and `AZURE_OPENAI_API_VERSION`.

Submission flow:

```text
Student submits answers
  -> backend loads correct answers and marks
  -> backend calculates score and correct count
  -> backend sends question/answer payload to Azure OpenAI
  -> AI response text is saved in AttemptTest.aiAnalysis
  -> attempt is marked submitted
```

If the AI request fails, `getAiAnalysis` returns `Failed to load Ai-Analysis report.`

## 15. Main User Journeys

Student registration:

```text
Submit registration details
  -> validate fields and duplicate email/roll number
  -> create OTP and otpToken cookie
  -> email OTP
  -> verify OTP
  -> create User
```

Student test:

```text
Login
  -> refreshToken cookie is set
  -> GET /student/getConductedTest
  -> choose a test
  -> GET /student/getTest/:testId
  -> attempt is created or resumed
  -> POST /student/submitTest
  -> score and AI analysis are saved
```

Admin:

```text
Admin login
  -> refreshToken cookie is set
  -> download question template
  -> upload completed Excel file and test metadata
  -> backend creates test and questions
  -> view conducted tests
  -> export test report
```

## 16. Security Design

Current security features:

- Passwords are hashed before storage.
- JWTs are stored in HTTP-only cookies.
- Cookies use `secure: true` and `sameSite: "None"` for cross-site frontend/backend deployment.
- Student APIs are protected with `userAuth`.
- Admin APIs are protected with `adminAuth`.
- OTP values are hashed before storage.
- OTP documents expire automatically through a TTL index.
- Google login/registration verifies ID tokens against a configured client ID.
- AI, database, mail, and OAuth credentials are read from environment variables.

Security considerations:

- `secure: true` cookies require HTTPS; local HTTP development may need environment-specific cookie options.
- `JWT_SECRET` should be long, random, and private.
- OTP verification currently has code defects that should be fixed before relying on it.
- Password reset accepts any new password value and does not currently enforce complexity rules.
- Avoid logging OTPs, email credential state, and sensitive payloads in production.

## 17. Error Handling and Response Patterns

Most controllers use `try/catch`, log the error, and return a JSON response. Current response keys vary across controllers: `status`, `success`, `message`, `messsage`, `user`, `tests`, `test`, `attemptId`, and `result`.

Recommendation: standardize on either `status` or `success`, use `message` consistently, and normalize HTTP status codes.

## 18. How To Run

Install dependencies:

```bash
npm install
```

Start in development:

```bash
npm run dev
```

Start in production:

```bash
npm start
```

The app listens on `0.0.0.0:${PORT}`.

## 19. Known Issues and Improvement Scope

These items were found while aligning the documentation with the current code:

- `verifyOtp.js` is mounted but currently references missing imports (`jwt`, `bcrypt`) and mismatched variables (`otpDoc`, `otpHash`) instead of the loaded `_otp.otp`.
- `verifyme.js` should `await User.findById(req.userId)`.
- `registerWithGoogle.js` should create `user_`, not `user`.
- `loginController.js` checks `rollNo`, but `User.js` defines `rollno`.
- `adminAuth.js` should set `req.userId = user._id`; it currently uses `user.userId`.
- `takeTest.js` should use `findOne` or check `t.length` for the active-test availability check.
- `Question.level` has enum values `easy`, `medium`, `hard`, but the default is currently `dsa`.
- `addQuestionsForTest.js` should not call `res` because the helper does not receive it.
- `feedbackController.js` returns HTTP `300` for missing feedback; a `400` response would be clearer.
- Swagger dependencies are installed but Swagger routes are not mounted.
- Several older practice-test and subject APIs remain in comments or unused files; keep or remove them based on product direction.
