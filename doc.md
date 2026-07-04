# API Documentation

This document covers the currently active APIs mounted in `server.js`.

## Base Setup

- Server entry: `server.js`
- Body parsers:
  - JSON: `application/json`
  - URL encoded: `application/x-www-form-urlencoded`
- Cookie auth:
  - Login stores JWT in cookie named `refreshToken`.
  - Protected APIs expect `refreshToken` cookie.
- CORS:
  - Origin comes from `process.env.ONLINE_URL`
  - Credentials are enabled.

## Active Route Groups

| Base path   | Middleware  | Purpose                 |
|-----------  |------------ |-------------------------|
| `/user`     | None        | Public user auth routes |
| `/student`  | `userAuth`  | Student test routes     |
| `/admin`    | `adminAuth` | Admin routes            |
| `/verifyme` | `userAuth`  | Verify logged-in user   |

## Common Auth Errors

Protected routes can return:

```json
{
  "message": "No refresh token provided"
}
```

```json
{
  "message": "Invalid refresh token"
}
```

Admin-only routes can also return:

```json
{
  "message": "session expire."
}
```

---

# Public User APIs

## Health/Test Route

```http
GET /user/kk
```

### Request

No body, no auth required.

### Response

```text
hello bhai
```

---

## Register User

```http
POST /user/register
```

### Request Body

Content-Type: `application/json`

| Field | Type | Required | Notes |
---|---:|---:|---|
| `rollno` | string | Yes | Must be unique |
| `name` | string | Yes | User full name |
| `branch` | string | Yes | Student branch |
| `passingYear` | number | Yes | Passing year |
| `year` | number | Yes | Enum: `1`, `2`, `3`, `4` |
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Stored hashed by model pre-save hook |

### Example Request

```json
{
  "rollno": "22CS001",
  "name": "Rahul Kumar",
  "branch": "CSE",
  "passingYear": 2027,
  "year": 3,
  "email": "rahul@example.com",
  "password": "secret123"
}
```

### Success Response

Status: `201`

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "USER_ID",
    "rollno": "22CS001",
    "name": "Rahul Kumar",
    "branch": "CSE",
    "passingYear": 2027,
    "year": 3,
    "email": "rahul@example.com",
    "role": "user",
    "createdAt": "2026-07-04T00:00:00.000Z",
    "updatedAt": "2026-07-04T00:00:00.000Z"
  }
}
```

### Error Responses

Status: `400`

```json
{
  "success": false,
  "message": "All fields are required"
}
```

Status: `409`

```json
{
  "success": false,
  "message": "Email already registered"
}
```

```json
{
  "success": false,
  "message": "Roll number already registered"
}
```

Status: `500`

```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "ERROR_MESSAGE"
}
```

---

## Login User

```http
POST /user/login
```

### Request Body

Content-Type: `application/json`

| Field | Type | Required | Notes |
---|---:|---:|---|
| `email` | string | Yes | Controller also checks this value against `rollNo`, but the request field name is `email` |
| `password` | string | Yes | Plain password |

### Example Request

```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

### Success Response

Status: `200`

Sets cookie:

| Cookie | Type | Options |
---|---|---|
| `refreshToken` | JWT string | `httpOnly`, `secure`, `sameSite=None`, `maxAge=30 days` |

```json
{
  "status": true,
  "user": {
    "_id": "USER_ID",
    "rollno": "22CS001",
    "name": "Rahul Kumar",
    "branch": "CSE",
    "passingyear": 2027,
    "email": "rahul@example.com",
    "role": "user"
  },
  "message": "Login successful"
}
```

### Error Responses

Status: `400`

```json
{
  "message": "Please provide password and either email or roll number."
}
```

Status: `401`

```json
{
  "message": "Invalid credentials"
}
```

Status: `500`

```json
{
  "message": "Server error during login",
  "error": "ERROR_MESSAGE"
}
```

---

## Logout User

```http
GET /user/logout
```

### Request

No body required.

### Success Response

Status: `200`

Clears cookie: `refreshToken`

```json
{
  "success": true,
  "message": "Logout successful. Session cache cleared."
}
```

### Error Response

Status: `500`

```json
{
  "success": false,
  "message": "Server error occurred executing user logout cleanup."
}
```

---

# Verify User API

## Verify Current User

```http
GET /verifyme
```

### Auth

Requires `refreshToken` cookie.

### Request

No body.

### Success Response

Status: `200`

```json
{
  "status": true,
  "user": {
    "_id": "USER_ID",
    "rollno": "22CS001",
    "name": "Rahul Kumar",
    "branch": "CSE",
    "passingyear": 2027,
    "email": "rahul@example.com"
  },
  "message": "Login successful"
}
```

### Error Response

Status: `500`

```json
{
  "message": "Server error during login",
  "error": "ERROR_MESSAGE"
}
```

---

# Student APIs

All student APIs require the `refreshToken` cookie.

## Get Conducted Tests

```http
GET /student/getConductedTest
```

### Request

No body.

### Success Response

Status: `200`

```json
{
  "status": true,
  "tests": [
    {
      "_id": "TEST_ID",
      "name": "DSA Test",
      "year": 3,
      "startAt": "2026-07-04T10:00:00.000Z",
      "endAt": "2026-07-04T11:00:00.000Z",
      "createdBy": "ADMIN_USER_ID",
      "isActive": true,
      "createdAt": "2026-07-04T00:00:00.000Z",
      "updatedAt": "2026-07-04T00:00:00.000Z"
    }
  ]
}
```

Notes:

- `questions` are excluded from this response.
- Controller filters by `isActive: true` and `year: req.year`.

### Error Response

Status: `500`

```json
{
  "status": false
}
```

---

## Get Test For Attempt

```http
GET /student/getTest/:testId
```

### Path Params

| Param | Type | Required | Notes |
---|---:|---:|---|
| `testId` | MongoDB ObjectId string | Yes | Test id |

### Request

No body.

### Success Response

Status: `201`

Creates an attempt if one does not already exist for the logged-in user and test.

```json
{
  "status": true,
  "test": {
    "_id": "TEST_ID",
    "name": "DSA Test",
    "year": 3,
    "questions": [
      {
        "question": {
          "_id": "QUESTION_ID",
          "testId": "TEST_ID",
          "question": "What is a stack?",
          "questionImage": "",
          "options": ["LIFO", "FIFO", "Tree", "Graph"],
          "topic": "Data Structures",
          "subject": "dsa",
          "level": "easy",
          "about": "",
          "mark": 2
        }
      }
    ],
    "startAt": "2026-07-04T10:00:00.000Z",
    "endAt": "2026-07-04T11:00:00.000Z",
    "createdBy": "ADMIN_USER_ID",
    "isActive": true
  },
  "attemptId": "ATTEMPT_ID"
}
```

Notes:

- Question `answer` is excluded from populated question data.
- Controller filters the test by `_id`, `isActive: true`, and `year: req.year`.

### Error Response

Status: `500`

```json
{
  "status": false,
  "message": "Failed to initialize test session."
}
```

---

## Submit Test

```http
POST /student/submitTest
```

### Request Body

Content-Type: `application/json`

| Field | Type | Required | Notes |
---|---:|---:|---|
| `attemptId` | MongoDB ObjectId string | Yes | Attempt id returned by `GET /student/getTest/:testId` |
| `answers` | array | Yes | List of submitted answers |
| `answers[].question` | MongoDB ObjectId string | Yes | Question id |
| `answers[].answer` | string or null | No | Selected/submitted answer text |

### Example Request

```json
{
  "attemptId": "ATTEMPT_ID",
  "answers": [
    {
      "question": "QUESTION_ID_1",
      "answer": "LIFO"
    },
    {
      "question": "QUESTION_ID_2",
      "answer": null
    }
  ]
}
```

### Success Response

Status: `200`

```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "attempt": {
      "_id": "ATTEMPT_ID",
      "startAt": "2026-07-04T10:00:00.000Z",
      "endAt": "2026-07-04T10:45:00.000Z",
      "userId": "USER_ID",
      "testId": "TEST_ID",
      "status": "submitted",
      "answers": [
        {
          "question": "QUESTION_ID_1",
          "answer": "LIFO"
        }
      ],
      "correctAnswers": 1,
      "score": 0,
      "aiAnalysis": null,
      "createdAt": "2026-07-04T10:00:00.000Z",
      "updatedAt": "2026-07-04T10:45:00.000Z"
    },
    "score": 2,
    "correctAnswers": 1
  }
}
```

Notes:

- `score` in response is calculated from matching answers and question marks.
- The saved attempt currently updates `answers`, `correctAnswers`, `status`, and `endAt`. The schema has `score`, but controller does not save calculated `score` into the attempt.
- Answer matching is exact after trimming both strings.

### Error Responses

Status: `404`

```json
{
  "success": false,
  "message": "Attempt not found"
}
```

Status: `404`

```json
{
  "success": false,
  "message": "Test is over. You cannot submit answers now."
}
```

Status: `500`

```json
{
  "success": false,
  "message": "ERROR_MESSAGE"
}
```

---

# Admin APIs

All admin APIs require the `refreshToken` cookie and the logged-in user must have `role: "admin"`.

## Download Question Entry Template

```http
GET /admin/getQuestionEntryTemplateFile
```

### Request

No body.

### Success Response

Status: `200`

Returns an Excel file.

| Header | Value |
---|---|
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `Content-Disposition` | `attachment; filename="question-template.xlsx"` |

### Excel Columns

| Column | Field | Type | Required | Notes |
---|---|---:|---:|---|
| A | `Question` | string | Yes | Question text |
| B | `Question Image` | string | No | Image URL/path text |
| C | `Option 1` | string | Yes | Option text |
| D | `Option 2` | string | Yes | Option text |
| E | `Option 3` | string | Yes | Option text |
| F | `Option 4` | string | Yes | Option text |
| G | `Answer` | string | Yes | Must match correct option text for scoring |
| H | `Level` | string | Yes | Enum: `easy`, `medium`, `hard` |
| I | `Topic` | string | Yes | Topic name |
| J | `Subject` | string | Yes | Enum: `dsa`, `aptitude`, `programming`, `generalKnowledge` |
| K | `About` | string | No | Description/explanation |
| L | `Mark` | number | No | Defaults to `1` during upload if empty |

### Error Response

Status: `500`

```json
{
  "success": false,
  "message": "ERROR_MESSAGE"
}
```

---

## Generate Test With Questions

```http
POST /admin/generateTest
```

### Request

Content-Type: `multipart/form-data`

| Field | Type | Required | Notes |
---|---:|---:|---|
| `name` | string | Yes | Test name |
| `startAt` | date string | Yes | Date accepted by JavaScript/Mongoose Date |
| `endAt` | date string | Yes | Date accepted by JavaScript/Mongoose Date |
| `year` | number | Yes | Enum: `1`, `2`, `3`, `4` |
| `file` | `.xlsx` file | Yes | Uploaded through multer field name `file` |

### Example Request

```bash
curl -X POST "http://localhost:PORT/admin/generateTest" \
  -H "Cookie: refreshToken=JWT_TOKEN" \
  -F "name=DSA Test" \
  -F "startAt=2026-07-04T10:00:00.000Z" \
  -F "endAt=2026-07-04T11:00:00.000Z" \
  -F "year=3" \
  -F "file=@question-template.xlsx"
```

### Success Response

Status: `201`

```json
{
  "status": true,
  "test": {
    "id": "TEST_ID",
    "name": "DSA Test",
    "startAt": "2026-07-04T10:00:00.000Z",
    "endAt": "2026-07-04T11:00:00.000Z",
    "year": 3
  }
}
```

### Error Response

Status: `500`

```json
{
  "status": false,
  "message": "Failed to generate test"
}
```

---

## Admin Get Conducted Tests

```http
GET /admin/getConductedTest
```

### Request

No body.

### Success Response

Same controller as `GET /student/getConductedTest`.

Status: `200`

```json
{
  "status": true,
  "tests": [
    {
      "_id": "TEST_ID",
      "name": "DSA Test",
      "year": 3,
      "startAt": "2026-07-04T10:00:00.000Z",
      "endAt": "2026-07-04T11:00:00.000Z",
      "createdBy": "ADMIN_USER_ID",
      "isActive": true,
      "createdAt": "2026-07-04T00:00:00.000Z",
      "updatedAt": "2026-07-04T00:00:00.000Z"
    }
  ]
}
```

### Error Response

Status: `500`

```json
{
  "status": false
}
```

---

## Download Test Result Report

```http
GET /admin/checkResult/:testId
```

### Path Params

| Param | Type | Required | Notes |
---|---:|---:|---|
| `testId` | MongoDB ObjectId string | Yes | Test id |

### Request

No body.

### Success Response

Status: `200`

Returns an Excel file.

| Header | Value |
---|---|
| `Content-Type` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| `Content-Disposition` | `attachment; filename="<test_name>_report.xlsx"` |

### Excel Report Columns

| Column | Type | Notes |
---|---:|---|
| `S.No` | number | Row number |
| `Roll No` | string | User roll number |
| `Student Name` | string | User name |
| `Branch` | string | User branch |
| `Year` | number/string | User year if available |
| `Passing Year` | number/string | User passing year |
| `Email` | string | User email |
| `Status` | string | `Not submitted` for `in_progress`, otherwise attempt status |
| `Total Questions` | number | Count from attempt answers |
| `Attempted` | number | Non-empty answers count |
| `Not Attempted` | number | Total minus attempted |
| `Correct Answers` | number | Attempt correct answer count |
| `Score (%)` | string | Percentage based on correct answers / total answers |
| `AI Analysis` | string | JSON string if present, otherwise `-` |

### Error Responses

Status: `404`

```json
{
  "success": false,
  "message": "Test not found"
}
```

Status: `500`

```json
{
  "success": false,
  "message": "Failed to export report",
  "error": "ERROR_MESSAGE"
}
```

---

# Data Models Used By APIs

## User

```json
{
  "rollno": "string, required, unique",
  "name": "string, required",
  "branch": "string, required",
  "year": "number enum: 1 | 2 | 3 | 4, required",
  "passingYear": "number, required",
  "email": "string, required",
  "password": "string, required, hashed",
  "role": "string enum: user | admin, default user"
}
```

## Test

```json
{
  "name": "string, required",
  "year": "number enum: 1 | 2 | 3 | 4",
  "questions": [
    {
      "question": "Question ObjectId"
    }
  ],
  "startAt": "Date, required",
  "endAt": "Date, required",
  "createdBy": "User ObjectId, required",
  "isActive": "boolean, default true"
}
```

## Question

```json
{
  "testId": "Test ObjectId or null",
  "question": "string, required",
  "questionImage": "string or null",
  "options": ["string, required"],
  "answer": "string, required",
  "topic": "string",
  "subject": "dsa | aptitude | programming | generalKnowledge",
  "level": "easy | medium | hard",
  "about": "string",
  "mark": "number, default 2"
}
```

## AttemptTest

```json
{
  "startAt": "Date, default now",
  "endAt": "Date or null",
  "userId": "User ObjectId, required",
  "testId": "Test ObjectId, required",
  "status": "in_progress | submitted",
  "answers": [
    {
      "question": "Question ObjectId",
      "answer": "string or null"
    }
  ],
  "correctAnswers": "number or null",
  "score": "number, default 0",
  "aiAnalysis": "object or null"
}
```

# Implementation Notes

- Only routes mounted in `server.js` are included here. Commented routes are not documented as active APIs.
- `userAuth` sets `req.userId` and `req.role`, but it currently does not set `req.year`. Some student/test controllers filter using `req.year`, so those responses may be empty unless this is fixed.
- `adminAuth` sets `req.userId = user.userId`, but the user model uses `_id`. Admin test creation falls back to a hardcoded id if `req.userId` is missing.
- `verifyme` calls `User.findById(req.userId)` without `await`, so the returned user fields may not work as intended until fixed.
- Login response uses `passingyear`, while the schema field is `passingYear`.
