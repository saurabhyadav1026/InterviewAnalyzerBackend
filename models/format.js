const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    answer: "Hyper Text Markup Language",
    topic: "HTML",
    subjectId: "WEB101",
    about: "Basic HTML question"
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<a>", "<link>", "<href>", "<url>"],
    answer: "<a>",
    topic: "HTML",
    subjectId: "WEB101",
    about: "Anchor tag"
  },
  {
    question: "Which CSS property changes text color?",
    options: ["font-color", "text-color", "color", "background-color"],
    answer: "color",
    topic: "CSS",
    subjectId: "WEB101",
    about: "CSS color property"
  },
  {
    question: "Which CSS property is used for spacing outside an element?",
    options: ["padding", "margin", "border", "spacing"],
    answer: "margin",
    topic: "CSS",
    subjectId: "WEB101",
    about: "CSS margin"
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "<!-- -->", "#", "**"],
    answer: "//",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Single line comment"
  },
  {
    question: "Which keyword declares a constant variable?",
    options: ["let", "const", "var", "static"],
    answer: "const",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Constant declaration"
  },
  {
    question: "Which method prints output in the browser console?",
    options: [
      "console.print()",
      "console.log()",
      "print()",
      "document.log()"
    ],
    answer: "console.log()",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Console output"
  },
  {
    question: "Which operator checks both value and datatype?",
    options: ["==", "=", "===", "!="],
    answer: "===",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Strict equality"
  },
  {
    question: "Which company developed JavaScript?",
    options: ["Microsoft", "Netscape", "Google", "Apple"],
    answer: "Netscape",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "JavaScript history"
  },
  {
    question: "Which method converts JSON to JavaScript object?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.object()"
    ],
    answer: "JSON.parse()",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "JSON parsing"
  },
  {
    question: "Which HTTP method is used to create data?",
    options: ["GET", "POST", "DELETE", "PUT"],
    answer: "POST",
    topic: "API",
    subjectId: "WEB101",
    about: "REST API"
  },
  {
    question: "Which HTTP status code means Success?",
    options: ["200", "404", "500", "301"],
    answer: "200",
    topic: "API",
    subjectId: "WEB101",
    about: "HTTP response"
  },
  {
    question: "Which React hook is used for state?",
    options: ["useRef", "useState", "useEffect", "useMemo"],
    answer: "useState",
    topic: "React",
    subjectId: "WEB101",
    about: "React state"
  },
  {
    question: "Which React hook is used for side effects?",
    options: ["useState", "useMemo", "useEffect", "useRef"],
    answer: "useEffect",
    topic: "React",
    subjectId: "WEB101",
    about: "React effects"
  },
  {
    question: "Which package is used for routing in React?",
    options: [
      "react-router-dom",
      "react-router",
      "router-react",
      "react-navigation"
    ],
    answer: "react-router-dom",
    topic: "React",
    subjectId: "WEB101",
    about: "React routing"
  },
  {
    question: "Which command initializes a Node.js project?",
    options: ["npm init", "node init", "npm create", "node start"],
    answer: "npm init",
    topic: "Node.js",
    subjectId: "WEB101",
    about: "Node initialization"
  },
  {
    question: "Which framework is commonly used with Node.js?",
    options: ["Express", "Laravel", "Django", "Spring"],
    answer: "Express",
    topic: "Node.js",
    subjectId: "WEB101",
    about: "Express framework"
  },
  {
    question: "Which database is commonly used with Mongoose?",
    options: ["MySQL", "MongoDB", "PostgreSQL", "SQLite"],
    answer: "MongoDB",
    topic: "MongoDB",
    subjectId: "WEB101",
    about: "MongoDB database"
  },
  {
    question: "Which Mongoose method creates a new document?",
    options: ["insert()", "save()", "create()", "add()"],
    answer: "create()",
    topic: "MongoDB",
    subjectId: "WEB101",
    about: "Mongoose create"
  },
  {
    question: "Which middleware is used to parse JSON in Express?",
    options: [
      "express.json()",
      "bodyParser.json()",
      "app.json()",
      "json.parse()"
    ],
    answer: "express.json()",
    topic: "Express",
    subjectId: "WEB101",
    about: "Express middleware"
  }
];

const moreQuestions = [
  {
    question: "Which HTML tag is used to insert an image?",
    options: ["<img>", "<image>", "<picture>", "<src>"],
    answer: "<img>",
    topic: "HTML",
    subjectId: "WEB101",
    about: "Image tag"
  },
  {
    question: "Which HTML element is used to create an unordered list?",
    options: ["<ul>", "<ol>", "<li>", "<list>"],
    answer: "<ul>",
    topic: "HTML",
    subjectId: "WEB101",
    about: "Unordered list"
  },
  {
    question: "Which CSS property is used to make text bold?",
    options: ["font-style", "font-weight", "text-weight", "bold"],
    answer: "font-weight",
    topic: "CSS",
    subjectId: "WEB101",
    about: "Bold text"
  },
  {
    question: "Which CSS property controls the size of text?",
    options: ["font-size", "text-size", "size", "font-style"],
    answer: "font-size",
    topic: "CSS",
    subjectId: "WEB101",
    about: "Font size"
  },
  {
    question: "Which keyword is used to declare a block-scoped variable?",
    options: ["var", "let", "const", "define"],
    answer: "let",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Block scope"
  },
  {
    question: "Which JavaScript function displays an alert box?",
    options: ["alert()", "prompt()", "console.log()", "confirm()"],
    answer: "alert()",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Alert box"
  },
  {
    question: "Which loop executes at least once?",
    options: ["for", "while", "do...while", "foreach"],
    answer: "do...while",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Loop types"
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Array methods"
  },
  {
    question: "Which method removes the last element of an array?",
    options: ["shift()", "pop()", "push()", "splice()"],
    answer: "pop()",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Array methods"
  },
  {
    question: "Which DOM method selects an element by ID?",
    options: [
      "getElementById()",
      "querySelectorAll()",
      "getElementsByClassName()",
      "getElement()"
    ],
    answer: "getElementById()",
    topic: "DOM",
    subjectId: "WEB101",
    about: "DOM selection"
  },
  {
    question: "Which DOM method selects the first matching CSS selector?",
    options: [
      "querySelector()",
      "querySelectorAll()",
      "getElementById()",
      "findElement()"
    ],
    answer: "querySelector()",
    topic: "DOM",
    subjectId: "WEB101",
    about: "DOM selector"
  },
  {
    question: "Which Git command uploads local commits to GitHub?",
    options: ["git push", "git pull", "git clone", "git fetch"],
    answer: "git push",
    topic: "Git",
    subjectId: "WEB101",
    about: "Push commits"
  },
  {
    question: "Which Git command downloads a repository?",
    options: ["git clone", "git init", "git push", "git merge"],
    answer: "git clone",
    topic: "Git",
    subjectId: "WEB101",
    about: "Clone repository"
  },
  {
    question: "Which Bootstrap class creates a button?",
    options: [".btn", ".button", ".btn-primary", ".button-primary"],
    answer: ".btn",
    topic: "Bootstrap",
    subjectId: "WEB101",
    about: "Bootstrap button"
  },
  {
    question: "Which Bootstrap class creates a responsive container?",
    options: [".container", ".wrapper", ".row", ".grid"],
    answer: ".container",
    topic: "Bootstrap",
    subjectId: "WEB101",
    about: "Bootstrap container"
  },
  {
    question: "Which package is commonly used to hash passwords in Node.js?",
    options: ["bcrypt", "jsonwebtoken", "express", "mongoose"],
    answer: "bcrypt",
    topic: "Node.js",
    subjectId: "WEB101",
    about: "Password hashing"
  },
  {
    question: "Which package is commonly used for authentication tokens?",
    options: ["jsonwebtoken", "bcrypt", "cors", "dotenv"],
    answer: "jsonwebtoken",
    topic: "Node.js",
    subjectId: "WEB101",
    about: "JWT authentication"
  },
  {
    question: "Which Express method defines a GET route?",
    options: ["app.get()", "app.post()", "app.use()", "app.listen()"],
    answer: "app.get()",
    topic: "Express",
    subjectId: "WEB101",
    about: "GET route"
  },
  {
    question: "Which Mongoose method finds all documents?",
    options: ["find()", "findOne()", "create()", "save()"],
    answer: "find()",
    topic: "MongoDB",
    subjectId: "WEB101",
    about: "Find documents"
  },
  {
    question: "Which MongoDB method deletes one document?",
    options: ["deleteOne()", "remove()", "drop()", "destroy()"],
    answer: "deleteOne()",
    topic: "MongoDB",
    subjectId: "WEB101",
    about: "Delete document"
  }
];

const moreQuestions2 = [
  {
    question: "Which HTML tag is used to create a table row?",
    options: ["<tr>", "<td>", "<table>", "<th>"],
    answer: "<tr>",
    topic: "HTML",
    subjectId: "WEB101",
    about: "Table row"
  },
  {
    question: "Which HTML tag is used to create a table cell?",
    options: ["<td>", "<tr>", "<th>", "<table>"],
    answer: "<td>",
    topic: "HTML",
    subjectId: "WEB101",
    about: "Table data cell"
  },
  {
    question: "Which CSS property is used to change the background color?",
    options: ["background", "background-color", "color", "bg-color"],
    answer: "background-color",
    topic: "CSS",
    subjectId: "WEB101",
    about: "Background color"
  },
  {
    question: "Which CSS property aligns text horizontally?",
    options: ["align", "text-align", "font-align", "justify-content"],
    answer: "text-align",
    topic: "CSS",
    subjectId: "WEB101",
    about: "Text alignment"
  },
  {
    question: "Which JavaScript method joins array elements into a string?",
    options: ["join()", "concat()", "split()", "slice()"],
    answer: "join()",
    topic: "JavaScript",
    subjectId: "WEB101",
    about: "Array join"
  }]