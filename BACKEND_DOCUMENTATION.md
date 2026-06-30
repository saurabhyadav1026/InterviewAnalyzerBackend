# InterviewAnalyzer Backend Documentation

## 1. Project Overview

InterviewAnalyzer is a backend API for an online interview/quiz assessment platform. It allows users to register, log in, select a subject, generate a randomized test, submit answers, and receive AI-based performance analysis. Admin users can manage MCQ questions and view user data by date range.

The backend is built with Node.js, Express.js, MongoDB, Mongoose, JWT authentication, cookie-based sessions, bcrypt password hashing, and Azure OpenAI for test feedback generation.

## 2. Core Features

- User registration and login
- Role-based authentication for users and admins
- Secure password hashing using bcrypt
- Cookie-based JWT session handling
- Subject listing for test selection
- Randomized test generation from question bank
- Test submission with answer storage
- AI-generated performance report
- User test history
- Admin question creation, update, and deletion
- Admin user lookup by registration date range
- Optional secure change-password bundle with rate limiting and password validation

## 3. Technology Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcryptjs |
| Session Storage | HTTP-only cookies |
| AI Integration | Azure OpenAI through `openai` SDK |
| Environment Config | dotenv |
| CORS | cors |
| API Docs Dependency | swagger-jsdoc, swagger-ui-express |

## 4. Project Structure

```text
InterviewAnalyzer/
├── server.js
├── package.json
├── config/
│   ├── db.js
│   ├── ai_config.js
│   └── ai_instruction.js
├── models/
│   ├── User.js
│   ├── Subject.js
│   ├── Question.js
│   └── Test.js
├── routes/
│   ├── userRoute.js
│   ├── v1Route.js
│   └── v1AdminRoute.js
├── middlewares/
│   ├── userAuth.js
│   └── adminAuth.js
└── controllers/
    ├── logoutController.js
    ├── changePasswordBundle.js
    ├── student-controller/
    │   ├── registerController.js
    │   ├── loginController.js
    │   ├── updateProfile.js
    │   ├── getSubjectList.js
    │   ├── generateTest.js
    │   ├── submitTest.js
    │   ├── getTestHistory.js
    │   └── subject.js
    └── admin-controller/
        ├── questionController.js
        ├── getUserBydate.js
        └── dateController.js
```

## 5. Application Entry Point

The backend starts from `server.js`.

Main responsibilities:

- Loads environment variables using `dotenv`.
- Creates an Express app.
- Enables CORS for the frontend URL stored in `ONLINE_URL`.
- Enables JSON body parsing.
- Enables cookie parsing.
- Connects to MongoDB using `dbconnect()`.
- Mounts public, user-protected, and admin-protected routes.
- Starts the server on `process.env.PORT`.

Route mounting:

| Base Path | Middleware | Purpose |
| --- | --- | --- |
| `/user` | None | Registration, login, logout, profile update |
| `/api/v1` | `userAuth` | Authenticated user test APIs |
| `/api/admin/v1` | `adminAuth` | Admin-only APIs |

## 6. Environment Variables

The project expects these environment variables:

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing/verifying JWT tokens |
| `ONLINE_URL` | Frontend URL allowed by CORS |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint |
| `AZURE_OPENAI_DEPLOYMENT` | Azure OpenAI deployment/model name |
| `AZURE_OPENAI_API_VERSION` | Azure OpenAI API version |
| `NODE_ENV` | Optional environment flag used by change-password bundle |

## 7. Database Connection

File: `config/db.js`

The backend connects to MongoDB using Mongoose:

```js
mongoose.connect(process.env.MONGO_URI)
```

Once connected, it logs:

```text
Mongodb is connected
```

## 8. Data Models

### 8.1 User Model

File: `models/User.js`

Represents a platform user or admin.

| Field | Type | Description |
| --- | --- | --- |
| `name` | String | Required user name |
| `email` | String | Required, unique, lowercased, validated email |
| `password` | String | Required hashed password |
| `role` | String | Either `user` or `admin`; default is `user` |
| `createdAt` | Date | Added by timestamps |
| `updatedAt` | Date | Added by timestamps |

Important behavior:

- Passwords are hashed automatically before saving.
- bcrypt salt rounds are set to `10`.

### 8.2 Subject Model

File: `models/Subject.js`

Represents a test subject.

| Field | Type | Description |
| --- | --- | --- |
| `name` | String | Required subject name |

Example subjects:

- DSA
- Web Development
- Aptitude

### 8.3 Question Model

File: `models/Question.js`

Represents one MCQ question.

| Field | Type | Description |
| --- | --- | --- |
| `question` | String | Required question text |
| `questionImage` | String | Optional image URL/path |
| `options` | Array of String | Required answer options |
| `answer` | String | Required correct answer |
| `topic` | String | Topic name such as Sorting, Graph, Tree |
| `subjectId` | ObjectId | Reference to `Subject` |
| `about` | String | Extra description/category |

### 8.4 Test Model

File: `models/Test.js`

Represents a generated quiz attempt.

| Field | Type | Description |
| --- | --- | --- |
| `userId` | String | ID of the user who generated the test |
| `subject` | ObjectId | Reference to selected subject |
| `questions` | Array | Question references and user answers |
| `questions.question` | ObjectId | Reference to `Question` |
| `questions.answer` | String | User-selected answer; default is `null` |
| `startTime` | Date | Test start time |
| `endTime` | Date | Test submission time |
| `aiAnalysis` | Object | AI-generated performance report |

## 9. Authentication and Authorization

### 9.1 Login Token Generation

File: `controllers/student-controller/loginController.js`

After successful login:

- The user is found by `email` and `role`.
- The password is compared using bcrypt.
- A JWT token is generated with:
  - `userId`
  - `role`
  - expiry of `30d`
- Token is stored in a cookie named `refreshToken`.

Cookie options:

| Option | Value |
| --- | --- |
| `httpOnly` | `true` |
| `secure` | `true` |
| `sameSite` | `None` |
| `maxAge` | 30 days |

### 9.2 User Middleware

File: `middlewares/userAuth.js`

Responsibilities:

- Reads `refreshToken` from cookies.
- Verifies JWT using `JWT_SECRET`.
- Fetches user from database.
- Attaches `req.userId` and `req.role`.
- Blocks invalid or missing sessions.

### 9.3 Admin Middleware

File: `middlewares/adminAuth.js`

Responsibilities:

- Reads `refreshToken`.
- Verifies JWT.
- Fetches user.
- Allows request only if `user.role === "admin"`.

Note: the current `adminAuth.js` uses `jwt` and `User`, but the import lines are missing in the file. For the middleware to run correctly, it should import:

```js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
```

## 10. API Endpoints

### 10.1 Public User Routes

Base path: `/user`

#### Register User

```http
POST /user/register
```

Request body:

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password123",
  "role": "user"
}
```

Behavior:

- Validates required fields.
- Checks whether email already exists.
- Creates a user.
- Password is hashed by the User model pre-save hook.

Success response:

```json
{
  "status": true,
  "msg": "Register successfully"
}
```

#### Login User

```http
POST /user/login
```

Request body:

```json
{
  "email": "student@example.com",
  "password": "password123",
  "role": "user"
}
```

Behavior:

- Validates email and password.
- Finds user by email and role.
- Compares password with bcrypt.
- Sets `refreshToken` cookie.
- Returns basic user details.

Success response:

```json
{
  "status": true,
  "user": {
    "_id": "userId",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "user",
    "message": "Login successful"
  }
}
```

#### Logout User

```http
GET /user/logout
```

Behavior:

- Clears the `refreshToken` cookie.
- Returns logout success message.

#### Update Profile

```http
PUT /user/updateProfile
```

Request body:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

Behavior:

- Updates the logged-in user's name and email.

Current note:

- This route is currently mounted without `userAuth`, but the controller uses `req.userId`. It should ideally be protected by authentication.
- The controller uses `User.findAndUpdateOne`, but the correct Mongoose method is usually `findOneAndUpdate` or `updateOne`.

### 10.2 Authenticated Student Routes

Base path: `/api/v1`

All routes under this base path pass through `userAuth`.

#### Get Subject List

```http
GET /api/v1/getsubjects
```

Behavior:

- Fetches all subjects from MongoDB.
- Used to show available test categories.

Success response:

```json
{
  "status": true,
  "sublist": []
}
```

#### Generate Test

```http
GET /api/v1/generateTest?subjectId=<subjectId>
```

Behavior:

- Converts `subjectId` into a MongoDB ObjectId.
- Finds questions matching the selected subject.
- Randomly samples 20 questions using MongoDB aggregation `$sample`.
- Creates a new Test document.
- Stores question IDs with empty answers.
- Returns the populated test.

Flow:

```text
User selects subject
        ↓
GET /api/v1/generateTest
        ↓
Find 20 random questions
        ↓
Create Test document
        ↓
Populate questions and subject
        ↓
Return test to frontend
```

#### Get Test

```http
GET /api/v1/getTest?testId=<testId>
```

Behavior:

- Fetches a test by ID.
- Populates question details.
- Populates subject details.

#### Submit Test

```http
POST /api/v1/submitTest
```

Request body:

```json
{
  "testId": "testId",
  "questions": [
    {
      "question": "questionId",
      "answer": "Selected Option"
    }
  ]
}
```

Behavior:

- Updates the Test document with submitted answers.
- Sets `endTime`.
- Sends question/answer data to Azure OpenAI.
- Stores AI analysis in the Test document.
- Returns test ID and AI analysis status.

#### Get Test History

```http
GET /api/v1/getTestHistory
```

Behavior:

- Uses `req.userId` from authentication middleware.
- Fetches all tests for the logged-in user.
- Sorts recent tests first.

Success response:

```json
{
  "message": "Test history retrieved successfully",
  "history": []
}
```

### 10.3 Admin Routes

Base path: `/api/admin/v1`

These routes are mounted behind `adminAuth`. The route file also applies `adminMiddleware` again on individual routes, so admin validation happens twice.

#### Add Question

```http
POST /api/admin/v1/addQuestion
```

Request body:

```json
{
  "question": "What is the worst-case time complexity of Bubble Sort?",
  "options": ["O(log n)", "O(n)", "O(n²)", "O(n log n)"],
  "answer": "O(n²)",
  "topic": "Sorting",
  "subjectId": "subjectId",
  "about": "Bubble Sort"
}
```

Behavior:

- Checks whether the same question already exists.
- Creates a new question.

#### Update Question

```http
POST /api/admin/v1/updateQuestion/:id
```

Behavior:

- Updates question text, options, answer, topic, subject, and about field.

Current note:

- Route uses `:id`, but controller reads `req.params._id`. It should read `req.params.id` to match the route.

#### Delete Question

```http
DELETE /api/admin/v1/deleteQuestion/:id
```

Behavior:

- Checks if question exists.
- Deletes the question by ID.

#### Get Users By Date Range

```http
GET /api/admin/v1/usre/bydate?startDate=2026-01-01&endDate=2026-01-31
```

Behavior:

- Finds users created between `startDate` and `endDate`.
- Returns count and matching users.

Current note:

- Route path is spelled `/usre/bydate`; it likely should be `/user/bydate`.

## 11. AI Performance Analysis

Files:

- `config/ai_config.js`
- `config/ai_instruction.js`
- `controllers/student-controller/submitTest.js`

The backend uses Azure OpenAI to generate a structured report after test submission.

### AI Client Configuration

The OpenAI SDK is configured with Azure OpenAI settings:

```js
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: {
    "api-version": process.env.AZURE_OPENAI_API_VERSION
  },
  defaultHeaders: {
    "api-key": process.env.AZURE_OPENAI_API_KEY
  }
});
```

### AI Prompt Purpose

The system instruction tells the AI to:

- Compare student answer with correct answer.
- Identify strong topics.
- Identify weak topics.
- Generate concise feedback.
- Calculate strength and weakness percentages.
- Return only valid JSON.

Expected AI response shape:

```json
{
  "strengths": [
    {
      "title": "string",
      "desc": "string"
    }
  ],
  "improvements": [
    {
      "title": "string",
      "desc": "string"
    }
  ],
  "summary": "string",
  "strengthPercent": 80,
  "weaknessPercent": 20
}
```

### AI Analysis Flow

```text
Student submits answers
        ↓
Backend saves answers and endTime
        ↓
Question data is converted to JSON
        ↓
Azure OpenAI analyzes performance
        ↓
AI JSON response is parsed
        ↓
Report is saved in Test.aiAnalysis
        ↓
Frontend receives analysis
```

## 12. Optional Change Password Bundle

File: `controllers/changePasswordBundle.js`

This file contains a complete secure change-password implementation, but it is not currently mounted in the route files.

Included components:

- Swagger/OpenAPI documentation block
- Security audit logger
- Custom sliding-window rate limiter
- Bearer token authentication middleware
- Password complexity validation middleware
- Change-password controller
- Combined middleware stack

Security rules include:

- Current password is required.
- New password is required.
- Confirm password is required.
- New password must differ from current password.
- New password and confirm password must match.
- Password length must be 8 to 64 characters.
- Password must contain uppercase, lowercase, number, and special character.
- Common weak passwords are rejected.
- Password must not contain the user's name or email prefix.

To use it, a route can be added like:

```js
import {
  changePasswordMiddlewareStack,
  changePasswordController
} from "./controllers/changePasswordBundle.js";

app.post(
  "/api/v1/change-password",
  changePasswordMiddlewareStack,
  changePasswordController
);
```

Important note:

- The bundle expects Bearer token authentication.
- The main application currently uses cookie-based `refreshToken` authentication.
- Token payload compatibility should be checked before enabling this route because the bundle reads `decoded.id`, while the login controller signs `userId`.

## 13. Main User Journey

```text
Register
   ↓
Login
   ↓
JWT stored in HTTP-only cookie
   ↓
Fetch subject list
   ↓
Select subject
   ↓
Generate randomized test
   ↓
Submit answers
   ↓
AI analyzes performance
   ↓
View result and history
```

## 14. Main Admin Journey

```text
Admin login
   ↓
JWT stored in HTTP-only cookie
   ↓
Access admin routes
   ↓
Add/update/delete questions
   ↓
View users by date range
```

## 15. Security Design

Current security features:

- Password hashing with bcrypt.
- JWT session token.
- HTTP-only cookie to reduce direct JavaScript token access.
- Secure cookie flag for HTTPS.
- SameSite `None` for cross-site frontend/backend deployment.
- User route protection using `userAuth`.
- Admin route protection using role check.
- AI API key stored in environment variables.

Security considerations:

- `JWT_SECRET` must be strong and private.
- `secure: true` cookies require HTTPS in production.
- Admin middleware needs missing imports added.
- Profile update route should be protected.
- Token payload fields should be consistent across all auth middleware.
- Avoid logging full question/answer payloads in production if they include sensitive data.

## 16. Error Handling Pattern

Most controllers use:

```text
try
  perform database/API operation
catch
  log error
  return 500 response
```

Common response styles:

- `status: true/false`
- `success: true/false`
- `message`
- Returned data such as `user`, `test`, `history`, or `sublist`

For future consistency, response keys can be standardized across all controllers.

## 17. How To Run The Backend

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

Required `.env` example:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster-url/dbname
JWT_SECRET=your_strong_secret
ONLINE_URL=http://localhost:5173
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
AZURE_OPENAI_API_VERSION=2024-xx-xx
NODE_ENV=development
```

## 18. Presentation Summary

InterviewAnalyzer backend is an Express and MongoDB API that powers an assessment platform. It manages users, authentication, subjects, questions, tests, submissions, and AI-based analysis. The main innovation is the integration with Azure OpenAI, which transforms raw quiz responses into structured feedback showing strengths, improvements, and performance percentages.

The project is divided into clean backend layers:

- Routes define API endpoints.
- Controllers contain business logic.
- Models define MongoDB collections.
- Middleware handles authentication and authorization.
- Config files manage database and AI setup.

## 19. Current Limitations and Improvement Scope

These points can be presented as planned improvements:

- Add missing imports in `adminAuth.js`.
- Fix admin update question parameter from `req.params._id` to `req.params.id`.
- Protect `/user/updateProfile` with user authentication.
- Fix `updateProfile.js` to import `User` and use a valid Mongoose update method.
- Standardize response structure across APIs.
- Mount and align the change-password bundle with the current cookie-based auth system.
- Add validation for `subjectId`, `testId`, and question payloads.
- Add automated tests for auth, test generation, submission, and admin question management.
- Add Swagger route mounting so API documentation can be viewed in the browser.

