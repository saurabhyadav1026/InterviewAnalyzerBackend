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
import {dsaMcqs} from "./Questions/dsaQuestion.js"
import Question from "./models/Question.js";



const app = express();
console.log( process.env.OfflineUrl)

app.use(cors());


app.use(cookieParser());
app.use(express.json());



/* function(origin, callback) {
        const allowedOrigins = [
            process.env.OfflineUrl,
            process.env.OnlineUrl
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    } */




// Use both DB connection methods just in case one replaces the other
try {
    dbconnect();
} catch (e) {
  console.log(e)
    console.log("Using fallback mongo connection");
}

app.use('/user',userRoute)
app.use("/api/v1", userAuth, v1Route);
app.use("/api/admin/v1",adminAuth,v1AdminRoute)


app.get("/addsub",async(req,res)=>{
  //const subject= await Subject.create({name:"DSA"})
  const question= await Question.insertMany(dsaMcqs)
    res.send(question[0])

})






app.listen(process.env.PORT,'0.0.0.0', () => {
    console.log(`Server is running on port `);
    
});




const msg=`[
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f6",
                    "question": "What is the worst-case time complexity of Bubble Sort?",
                    "questionImage": "",
                    "options": [
                        "O(log n)",
                        "O(n)",
                        "O(n²)",
                        "O(n log n)"
                    ],
                    "answer": "O(n²)",
                    "topic": "Sorting",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Bubble Sort",
                    "__v": 0
                },
                "answer": "O(n²)",
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d5fb"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f9",
                    "question": "Which data structure is used for backtracking algorithms?",
                    "questionImage": "",
                    "options": [
                        "Queue",
                        "Stack",
                        "Heap",
                        "Array"
                    ],
                    "answer": "Stack",
                    "topic": "Stack",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Backtracking",
                    "__v": 0
                },
                "answer": "Stack",
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d5fc"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3fa00",
                    "question": "What is the minimum number of edges in a connected graph with n vertices?",
                    "questionImage": "",
                    "options": [
                        "n",
                        "n-1",
                        "n+1",
                        "n(n-1)/2"
                    ],
                    "answer": "n-1",
                    "topic": "Graph",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Connected Graph",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d5fd"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9ee",
                    "question": "What is the height of a tree with only one root node?",
                    "questionImage": "",
                    "options": [
                        "0",
                        "1",
                        "2",
                        "-1"
                    ],
                    "answer": "0",
                    "topic": "Tree",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Tree Height",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d5fe"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f7",
                    "question": "Which traversal of a Binary Search Tree (BST) gives elements in sorted order?",
                    "questionImage": "",
                    "options": [
                        "Preorder",
                        "Postorder",
                        "Inorder",
                        "Level Order"
                    ],
                    "answer": "Inorder",
                    "topic": "Tree",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "BST Traversal",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d5ff"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f1",
                    "question": "Which sorting algorithm works by dividing the array into smaller subarrays around a pivot?",
                    "questionImage": "",
                    "options": [
                        "Merge Sort",
                        "Quick Sort",
                        "Bubble Sort",
                        "Insertion Sort"
                    ],
                    "answer": "Quick Sort",
                    "topic": "Sorting",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Quick Sort",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d600"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f5",
                    "question": "Which algorithm is used to find the minimum spanning tree of a graph?",
                    "questionImage": "",
                    "options": [
                        "Dijkstra",
                        "KMP",
                        "Prim",
                        "Binary Search"
                    ],
                    "answer": "Prim",
                    "topic": "Graph",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Minimum Spanning Tree",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d601"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3fa0a",
                    "question": "Which data structure is primarily used for efficient prefix searching?",
                    "questionImage": "",
                    "options": [
                        "Heap",
                        "Trie",
                        "Stack",
                        "Queue"
                    ],
                    "answer": "Trie",
                    "topic": "Tree",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Prefix Search",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d602"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9e9",
                    "question": "Which data structure uses nodes connected by pointers?",
                    "questionImage": "",
                    "options": [
                        "Array",
                        "Linked List",
                        "Stack",
                        "Heap"
                    ],
                    "answer": "Linked List",
                    "topic": "Linked List",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Pointers",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d603"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9fe",
                    "question": "Which data structure is best suited for implementing an undo operation?",
                    "questionImage": "",
                    "options": [
                        "Queue",
                        "Heap",
                        "Stack",
                        "Graph"
                    ],
                    "answer": "Stack",
                    "topic": "Stack",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Undo Operation",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d604"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3fa03",
                    "question": "What is the average-case time complexity of searching in a hash table?",
                    "questionImage": "",
                    "options": [
                        "O(1)",
                        "O(log n)",
                        "O(n)",
                        "O(n log n)"
                    ],
                    "answer": "O(1)",
                    "topic": "Hashing",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Hash Table",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d605"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9fc",
                    "question": "Which algorithm is used to detect cycles in a graph using Disjoint Set?",
                    "questionImage": "",
                    "options": [
                        "Kruskal's Algorithm",
                        "Union-Find",
                        "Dijkstra's Algorithm",
                        "Floyd Warshall"
                    ],
                    "answer": "Union-Find",
                    "topic": "Graph",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Cycle Detection",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d606"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9e8",
                    "question": "What is the worst-case time complexity of linear search?",
                    "questionImage": "",
                    "options": [
                        "O(log n)",
                        "O(n)",
                        "O(1)",
                        "O(n²)"
                    ],
                    "answer": "O(n)",
                    "topic": "Searching",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Linear Search",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d607"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3fa04",
                    "question": "Which tree data structure is specifically designed for efficient disk access?",
                    "questionImage": "",
                    "options": [
                        "AVL Tree",
                        "Binary Tree",
                        "B-Tree",
                        "Heap"
                    ],
                    "answer": "B-Tree",
                    "topic": "Tree",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "B-Tree",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d608"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3fa08",
                    "question": "Which algorithm is used for pattern matching in strings?",
                    "questionImage": "",
                    "options": [
                        "KMP Algorithm",
                        "Prim's Algorithm",
                        "Merge Sort",
                        "DFS"
                    ],
                    "answer": "KMP Algorithm",
                    "topic": "String Algorithms",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Pattern Matching",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d609"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f8",
                    "question": "What is the worst-case time complexity of searching in a Binary Search Tree?",
                    "questionImage": "",
                    "options": [
                        "O(1)",
                        "O(log n)",
                        "O(n)",
                        "O(n log n)"
                    ],
                    "answer": "O(n)",
                    "topic": "Tree",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "BST Search",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d60a"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f2",
                    "question": "Which graph traversal algorithm guarantees the shortest path in an unweighted graph?",
                    "questionImage": "",
                    "options": [
                        "DFS",
                        "BFS",
                        "Dijkstra",
                        "Prim"
                    ],
                    "answer": "BFS",
                    "topic": "Graph",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Shortest Path",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d60b"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9e6",
                    "question": "Which traversal technique visits the root node first?",
                    "questionImage": "",
                    "options": [
                        "Inorder",
                        "Postorder",
                        "Preorder",
                        "Level Order"
                    ],
                    "answer": "Preorder",
                    "topic": "Tree",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Tree Traversal",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d60c"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9fb",
                    "question": "What is the maximum number of edges in a simple undirected graph with n vertices?",
                    "questionImage": "",
                    "options": [
                        "n(n-1)",
                        "n²",
                        "n(n-1)/2",
                        "2n"
                    ],
                    "answer": "n(n-1)/2",
                    "topic": "Graph",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Graph Properties",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d60d"
            },
            {
                "question": {
                    "_id": "6a42b2f237b36ac7a7b3f9f4",
                    "question": "Which data structure is commonly used to implement a priority queue?",
                    "questionImage": "",
                    "options": [
                        "Linked List",
                        "Stack",
                        "Heap",
                        "Graph"
                    ],
                    "answer": "Heap",
                    "topic": "Heap",
                    "subjectId": "6a42b1d1108b942495d68831",
                    "about": "Priority Queue",
                    "__v": 0
                },
                "answer": null,
                "isCorrect": null,
                "_id": "6a42e8b90959c038b6e8d60e"
            }
        ]`