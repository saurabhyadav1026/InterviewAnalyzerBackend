const dsaQuestion=[
  {
    "question": "Which data structure follows the LIFO principle?",
    "options": ["Queue", "Stack", "Linked List", "Tree"],
    "answer": "Stack",
    "topic": "Stack",
    "subjectId": "DSA001",
    "about": "Stack follows Last In First Out (LIFO) order where the last inserted element is removed first."
  },
  {
    "question": "Which data structure follows the FIFO principle?",
    "options": ["Stack", "Queue", "Tree", "Graph"],
    "answer": "Queue",
    "topic": "Queue",
    "subjectId": "DSA001",
    "about": "Queue follows First In First Out (FIFO) order where the first inserted element is removed first."
  },
  {
    "question": "What is the time complexity of Binary Search?",
    "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    "answer": "O(log n)",
    "topic": "Searching",
    "subjectId": "DSA001",
    "about": "Binary Search repeatedly divides the search space into halves."
  },
  {
    "question": "Which sorting algorithm has the best average-case complexity among the following?",
    "options": ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    "answer": "Merge Sort",
    "topic": "Sorting",
    "subjectId": "DSA001",
    "about": "Merge Sort has an average and worst-case time complexity of O(n log n)."
  },
  {
    "question": "Which tree traversal visits the root node first?",
    "options": ["Inorder", "Postorder", "Preorder", "Level Order"],
    "answer": "Preorder",
    "topic": "Tree",
    "subjectId": "DSA001",
    "about": "Preorder traversal follows Root → Left → Right."
  },
  {
    "question": "Which data structure is used in Breadth First Search (BFS)?",
    "options": ["Stack", "Queue", "Array", "Linked List"],
    "answer": "Queue",
    "topic": "Graph",
    "subjectId": "DSA001",
    "about": "BFS explores nodes level by level using a queue."
  },
  {
    "question": "Which data structure is used in Depth First Search (DFS)?",
    "options": ["Queue", "Array", "Stack", "Heap"],
    "answer": "Stack",
    "topic": "Graph",
    "subjectId": "DSA001",
    "about": "DFS explores as deep as possible before backtracking using a stack."
  },
  {
    "question": "What is the worst-case time complexity of Quick Sort?",
    "options": ["O(n log n)", "O(log n)", "O(n²)", "O(n)"],
    "answer": "O(n²)",
    "topic": "Sorting",
    "subjectId": "DSA001",
    "about": "Quick Sort reaches O(n²) when poor pivot selection occurs repeatedly."
  },
  {
    "question": "Which of the following is not a linear data structure?",
    "options": ["Array", "Queue", "Stack", "Tree"],
    "answer": "Tree",
    "topic": "Data Structures",
    "subjectId": "DSA001",
    "about": "Tree is a hierarchical, non-linear data structure."
  },
  {
    "question": "What is the height of a tree with only one node?",
    "options": ["0", "1", "2", "-1"],
    "answer": "0",
    "topic": "Tree",
    "subjectId": "DSA001",
    "about": "A single-node tree has height 0 because there are no edges below the root."
  },
  {
    "question": "Which searching technique requires the data to be sorted?",
    "options": ["Linear Search", "Binary Search", "Hashing", "DFS"],
    "answer": "Binary Search",
    "topic": "Searching",
    "subjectId": "DSA001",
    "about": "Binary Search only works efficiently on sorted data."
  },
  {
    "question": "What is the time complexity of accessing an element in an array by index?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    "answer": "O(1)",
    "topic": "Array",
    "subjectId": "DSA001",
    "about": "Arrays provide constant-time random access using indices."
  },
  {
    "question": "Which sorting algorithm repeatedly swaps adjacent elements if they are in the wrong order?",
    "options": ["Merge Sort", "Quick Sort", "Bubble Sort", "Heap Sort"],
    "answer": "Bubble Sort",
    "topic": "Sorting",
    "subjectId": "DSA001",
    "about": "Bubble Sort compares and swaps adjacent elements repeatedly."
  },
  {
    "question": "Which data structure is primarily used to implement recursion?",
    "options": ["Queue", "Stack", "Tree", "Graph"],
    "answer": "Stack",
    "topic": "Stack",
    "subjectId": "DSA001",
    "about": "Recursive function calls are managed through the call stack."
  },
  {
    "question": "Which of the following is a self-balancing Binary Search Tree?",
    "options": ["AVL Tree", "Binary Tree", "Complete Tree", "Heap"],
    "answer": "AVL Tree",
    "topic": "Tree",
    "subjectId": "DSA001",
    "about": "AVL Trees maintain balance by performing rotations after insertions and deletions."
  },
  {
    "question": "What is the maximum number of children a node in a binary tree can have?",
    "options": ["1", "2", "3", "Unlimited"],
    "answer": "2",
    "topic": "Tree",
    "subjectId": "DSA001",
    "about": "A binary tree node can have at most two children."
  },
  {
    "question": "Which graph traversal algorithm uses a queue for processing nodes?",
    "options": ["DFS", "BFS", "Dijkstra", "Prim"],
    "answer": "BFS",
    "topic": "Graph",
    "subjectId": "DSA001",
    "about": "BFS uses a queue to visit nodes level by level."
  },
  {
    "question": "What is the average time complexity of appending an element to a dynamic array?",
    "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    "answer": "O(1)",
    "topic": "Array",
    "subjectId": "DSA001",
    "about": "Appending to a dynamic array is amortized O(1)."
  },
  {
    "question": "Which data structure is commonly used to implement a Priority Queue?",
    "options": ["Linked List", "Stack", "Heap", "Array"],
    "answer": "Heap",
    "topic": "Heap",
    "subjectId": "DSA001",
    "about": "Heaps efficiently support insertion and removal of the highest-priority element."
  },
  {
    "question": "Which algorithm is commonly used to find the shortest path in a weighted graph with non-negative weights?",
    "options": ["DFS", "BFS", "Dijkstra's Algorithm", "Binary Search"],
    "answer": "Dijkstra's Algorithm",
    "topic": "Graph",
    "subjectId": "DSA001",
    "about": "Dijkstra's Algorithm finds the shortest path from a source vertex to all other vertices."
  }
]
const apptiQuestion=[
  {
    "question": "What is 25% of 200?",
    "options": ["25", "50", "75", "100"],
    "answer": "50",
    "topic": "Percentage",
    "subjectId": "APT001",
    "about": "Percentage questions test the ability to calculate portions of a number."
  },
  {
    "question": "If a train travels 120 km in 2 hours, what is its speed?",
    "options": ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    "answer": "60 km/h",
    "topic": "Speed, Time and Distance",
    "subjectId": "APT001",
    "about": "Speed is calculated as Distance divided by Time."
  },
  {
    "question": "What is the average of 10, 20, 30, 40 and 50?",
    "options": ["25", "30", "35", "40"],
    "answer": "30",
    "topic": "Average",
    "subjectId": "APT001",
    "about": "Average is the sum of all values divided by the number of values."
  },
  {
    "question": "A shopkeeper gives a 10% discount on a ₹1000 item. What is the selling price?",
    "options": ["₹800", "₹850", "₹900", "₹950"],
    "answer": "₹900",
    "topic": "Profit and Loss",
    "subjectId": "APT001",
    "about": "Discount is deducted from the marked price."
  },
  {
    "question": "What is the simple interest on ₹1000 at 10% per annum for 2 years?",
    "options": ["₹100", "₹150", "₹200", "₹250"],
    "answer": "₹200",
    "topic": "Simple Interest",
    "subjectId": "APT001",
    "about": "Simple Interest = (P × R × T) / 100."
  },
  {
    "question": "If 5 workers complete a job in 10 days, how many days will 10 workers take?",
    "options": ["2", "5", "10", "20"],
    "answer": "5",
    "topic": "Time and Work",
    "subjectId": "APT001",
    "about": "Time and work are inversely proportional."
  },
  {
    "question": "Find the next number in the series: 2, 4, 8, 16, ?",
    "options": ["20", "24", "32", "64"],
    "answer": "32",
    "topic": "Number Series",
    "subjectId": "APT001",
    "about": "Each number is multiplied by 2."
  },
  {
    "question": "What is the ratio of 20 to 50?",
    "options": ["1:2", "2:5", "3:5", "4:5"],
    "answer": "2:5",
    "topic": "Ratio and Proportion",
    "subjectId": "APT001",
    "about": "Ratios compare two quantities."
  },
  {
    "question": "A sum doubles itself in 10 years at simple interest. What is the rate of interest?",
    "options": ["5%", "10%", "15%", "20%"],
    "answer": "10%",
    "topic": "Simple Interest",
    "subjectId": "APT001",
    "about": "For doubling, SI equals the principal amount."
  },
  {
    "question": "What is 15% of 400?",
    "options": ["50", "60", "70", "80"],
    "answer": "60",
    "topic": "Percentage",
    "subjectId": "APT001",
    "about": "Percentage calculation is a common aptitude topic."
  },
  {
    "question": "If a car covers 240 km in 4 hours, what is its speed?",
    "options": ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
    "answer": "60 km/h",
    "topic": "Speed, Time and Distance",
    "subjectId": "APT001",
    "about": "Speed = Distance ÷ Time."
  },
  {
    "question": "The average age of 5 students is 20 years. What is their total age?",
    "options": ["80", "90", "100", "110"],
    "answer": "100",
    "topic": "Average",
    "subjectId": "APT001",
    "about": "Total = Average × Number of items."
  },
  {
    "question": "A product is bought for ₹500 and sold for ₹600. What is the profit?",
    "options": ["₹50", "₹75", "₹100", "₹150"],
    "answer": "₹100",
    "topic": "Profit and Loss",
    "subjectId": "APT001",
    "about": "Profit = Selling Price - Cost Price."
  },
  {
    "question": "Find the next number: 1, 4, 9, 16, ?",
    "options": ["20", "24", "25", "36"],
    "answer": "25",
    "topic": "Number Series",
    "subjectId": "APT001",
    "about": "The series follows square numbers."
  },
  {
    "question": "If A:B = 3:4 and B:C = 2:5, then A:B:C is?",
    "options": ["3:4:5", "3:4:10", "3:2:5", "6:8:20"],
    "answer": "6:8:20",
    "topic": "Ratio and Proportion",
    "subjectId": "APT001",
    "about": "Ratios can be combined by equalizing common terms."
  },
  {
    "question": "What is 30% of 150?",
    "options": ["35", "40", "45", "50"],
    "answer": "45",
    "topic": "Percentage",
    "subjectId": "APT001",
    "about": "30% means 30 out of every 100."
  },
  {
    "question": "A can do a work in 12 days. What part of the work does he complete in 1 day?",
    "options": ["1/10", "1/12", "1/15", "1/20"],
    "answer": "1/12",
    "topic": "Time and Work",
    "subjectId": "APT001",
    "about": "One day's work is the reciprocal of total days."
  },
  {
    "question": "Find the missing number: 5, 10, 20, 40, ?",
    "options": ["50", "60", "70", "80"],
    "answer": "80",
    "topic": "Number Series",
    "subjectId": "APT001",
    "about": "Each term is doubled."
  },
  {
    "question": "A person earns ₹5000 and spends ₹4000. What percentage of income is saved?",
    "options": ["10%", "20%", "25%", "30%"],
    "answer": "20%",
    "topic": "Percentage",
    "subjectId": "APT001",
    "about": "Savings percentage = (Savings ÷ Income) × 100."
  },
  {
    "question": "The cost price of an item is ₹800 and it is sold at a 25% profit. What is the selling price?",
    "options": ["₹900", "₹950", "₹1000", "₹1100"],
    "answer": "₹1000",
    "topic": "Profit and Loss",
    "subjectId": "APT001",
    "about": "Selling Price = Cost Price + Profit."
  }
]

const dbmsQuestions=[
  {
    "question": "What does DBMS stand for?",
    "options": [
      "Database Management System",
      "Data Backup Management System",
      "Database Mapping System",
      "Data Management Service"
    ],
    "answer": "Database Management System",
    "topic": "Introduction to DBMS",
    "subjectId": "DBMS001",
    "about": "A DBMS is software used to create, manage, and manipulate databases."
  },
  {
    "question": "Which of the following is not a DBMS?",
    "options": [
      "MySQL",
      "Oracle",
      "MongoDB",
      "MS Word"
    ],
    "answer": "MS Word",
    "topic": "Introduction to DBMS",
    "subjectId": "DBMS001",
    "about": "MS Word is a word processing application, not a database management system."
  },
  {
    "question": "Which key uniquely identifies a record in a table?",
    "options": [
      "Foreign Key",
      "Primary Key",
      "Candidate Key",
      "Composite Key"
    ],
    "answer": "Primary Key",
    "topic": "Keys",
    "subjectId": "DBMS001",
    "about": "A primary key uniquely identifies each row in a table."
  },
  {
    "question": "Which SQL command is used to retrieve data from a table?",
    "options": [
      "INSERT",
      "UPDATE",
      "SELECT",
      "DELETE"
    ],
    "answer": "SELECT",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "The SELECT statement is used to fetch data from database tables."
  },
  {
    "question": "Which normal form removes partial dependency?",
    "options": [
      "1NF",
      "2NF",
      "3NF",
      "BCNF"
    ],
    "answer": "2NF",
    "topic": "Normalization",
    "subjectId": "DBMS001",
    "about": "Second Normal Form eliminates partial dependency on composite keys."
  },
  {
    "question": "What is a foreign key?",
    "options": [
      "A unique identifier",
      "A key used to link two tables",
      "A duplicate key",
      "A temporary key"
    ],
    "answer": "A key used to link two tables",
    "topic": "Keys",
    "subjectId": "DBMS001",
    "about": "A foreign key establishes a relationship between two tables."
  },
  {
    "question": "Which SQL command is used to add a new row to a table?",
    "options": [
      "ADD",
      "INSERT",
      "CREATE",
      "UPDATE"
    ],
    "answer": "INSERT",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "INSERT is used to add new records into a table."
  },
  {
    "question": "Which type of database model organizes data into tables?",
    "options": [
      "Hierarchical Model",
      "Network Model",
      "Relational Model",
      "Object Model"
    ],
    "answer": "Relational Model",
    "topic": "Database Models",
    "subjectId": "DBMS001",
    "about": "The relational model stores data in rows and columns."
  },
  {
    "question": "Which clause is used to filter records in SQL?",
    "options": [
      "ORDER BY",
      "GROUP BY",
      "WHERE",
      "HAVING"
    ],
    "answer": "WHERE",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "The WHERE clause filters rows based on specified conditions."
  },
  {
    "question": "What is normalization?",
    "options": [
      "Data duplication process",
      "Data organization process",
      "Data deletion process",
      "Data encryption process"
    ],
    "answer": "Data organization process",
    "topic": "Normalization",
    "subjectId": "DBMS001",
    "about": "Normalization reduces redundancy and improves data integrity."
  },
  {
    "question": "Which SQL command is used to modify existing records?",
    "options": [
      "ALTER",
      "MODIFY",
      "UPDATE",
      "CHANGE"
    ],
    "answer": "UPDATE",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "UPDATE modifies existing data in a table."
  },
  {
    "question": "Which normal form removes transitive dependency?",
    "options": [
      "1NF",
      "2NF",
      "3NF",
      "4NF"
    ],
    "answer": "3NF",
    "topic": "Normalization",
    "subjectId": "DBMS001",
    "about": "Third Normal Form removes transitive dependencies."
  },
  {
    "question": "Which SQL clause is used to sort query results?",
    "options": [
      "SORT BY",
      "GROUP BY",
      "ORDER BY",
      "ARRANGE BY"
    ],
    "answer": "ORDER BY",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "ORDER BY sorts records in ascending or descending order."
  },
  {
    "question": "What is a candidate key?",
    "options": [
      "A key that can uniquely identify records",
      "A duplicate key",
      "A foreign key",
      "A temporary key"
    ],
    "answer": "A key that can uniquely identify records",
    "topic": "Keys",
    "subjectId": "DBMS001",
    "about": "Candidate keys are possible choices for the primary key."
  },
  {
    "question": "Which SQL command removes all rows from a table but keeps the structure?",
    "options": [
      "DELETE",
      "REMOVE",
      "TRUNCATE",
      "DROP"
    ],
    "answer": "TRUNCATE",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "TRUNCATE removes all records while preserving the table structure."
  },
  {
    "question": "What is an entity in DBMS?",
    "options": [
      "A table relationship",
      "A real-world object",
      "A database query",
      "A key"
    ],
    "answer": "A real-world object",
    "topic": "ER Model",
    "subjectId": "DBMS001",
    "about": "An entity represents a real-world object or concept."
  },
  {
    "question": "Which operation combines rows from two tables based on a related column?",
    "options": [
      "UNION",
      "JOIN",
      "GROUP BY",
      "MERGE"
    ],
    "answer": "JOIN",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "JOIN is used to retrieve related data from multiple tables."
  },
  {
    "question": "What does ACID stand for in DBMS?",
    "options": [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Consistency, Integrity, Durability",
      "Atomicity, Clarity, Isolation, Durability",
      "Access, Consistency, Integrity, Data"
    ],
    "answer": "Atomicity, Consistency, Isolation, Durability",
    "topic": "Transactions",
    "subjectId": "DBMS001",
    "about": "ACID properties ensure reliable transaction processing."
  },
  {
    "question": "Which command permanently removes a table from the database?",
    "options": [
      "DELETE",
      "REMOVE",
      "DROP",
      "TRUNCATE"
    ],
    "answer": "DROP",
    "topic": "SQL",
    "subjectId": "DBMS001",
    "about": "DROP deletes the table structure and all its data."
  },
  {
    "question": "Which key is formed by combining two or more attributes?",
    "options": [
      "Primary Key",
      "Foreign Key",
      "Composite Key",
      "Candidate Key"
    ],
    "answer": "Composite Key",
    "topic": "Keys",
    "subjectId": "DBMS001",
    "about": "A composite key consists of multiple columns used together to uniquely identify a record."
  }
]

const osQuesitions=[
  {
    "question": "What is the primary function of an Operating System?",
    "options": [
      "Manage computer hardware and software resources",
      "Create documents",
      "Browse the internet",
      "Compile programs"
    ],
    "answer": "Manage computer hardware and software resources",
    "topic": "Introduction to Operating System",
    "subjectId": "OS001",
    "about": "An operating system acts as an interface between users and computer hardware."
  },
  {
    "question": "Which of the following is an Operating System?",
    "options": [
      "Linux",
      "Oracle",
      "MySQL",
      "MongoDB"
    ],
    "answer": "Linux",
    "topic": "Introduction to Operating System",
    "subjectId": "OS001",
    "about": "Linux is a popular open-source operating system."
  },
  {
    "question": "Which scheduling algorithm follows First Come First Serve principle?",
    "options": [
      "Round Robin",
      "FCFS",
      "Priority Scheduling",
      "SJF"
    ],
    "answer": "FCFS",
    "topic": "CPU Scheduling",
    "subjectId": "OS001",
    "about": "FCFS executes processes in the order they arrive."
  },
  {
    "question": "What is a process?",
    "options": [
      "A program in execution",
      "A file",
      "A folder",
      "A device driver"
    ],
    "answer": "A program in execution",
    "topic": "Process Management",
    "subjectId": "OS001",
    "about": "A process is an active instance of a program being executed."
  },
  {
    "question": "Which memory management technique divides memory into fixed-size blocks?",
    "options": [
      "Segmentation",
      "Paging",
      "Swapping",
      "Compaction"
    ],
    "answer": "Paging",
    "topic": "Memory Management",
    "subjectId": "OS001",
    "about": "Paging divides memory into fixed-size pages and frames."
  },
  {
    "question": "What is the full form of CPU?",
    "options": [
      "Central Processing Unit",
      "Computer Processing Unit",
      "Central Program Unit",
      "Control Processing Unit"
    ],
    "answer": "Central Processing Unit",
    "topic": "Computer System Structure",
    "subjectId": "OS001",
    "about": "CPU is the main processing unit of a computer."
  },
  {
    "question": "Which scheduling algorithm assigns a fixed time slice to each process?",
    "options": [
      "FCFS",
      "SJF",
      "Round Robin",
      "Priority Scheduling"
    ],
    "answer": "Round Robin",
    "topic": "CPU Scheduling",
    "subjectId": "OS001",
    "about": "Round Robin scheduling allocates a fixed time quantum to processes."
  },
  {
    "question": "What is deadlock?",
    "options": [
      "A process waiting indefinitely for resources",
      "A fast process execution",
      "Memory allocation",
      "CPU scheduling"
    ],
    "answer": "A process waiting indefinitely for resources",
    "topic": "Deadlock",
    "subjectId": "OS001",
    "about": "Deadlock occurs when processes are unable to proceed due to resource dependencies."
  },
  {
    "question": "Which of the following is not a type of Operating System?",
    "options": [
      "Batch OS",
      "Real-Time OS",
      "Distributed OS",
      "Compiler OS"
    ],
    "answer": "Compiler OS",
    "topic": "Types of Operating Systems",
    "subjectId": "OS001",
    "about": "Compiler is software, not an operating system type."
  },
  {
    "question": "What is virtual memory?",
    "options": [
      "A memory management technique using disk space as RAM",
      "A physical memory chip",
      "A cache memory",
      "A CPU register"
    ],
    "answer": "A memory management technique using disk space as RAM",
    "topic": "Memory Management",
    "subjectId": "OS001",
    "about": "Virtual memory allows larger programs to run than the available physical memory."
  },
  {
    "question": "Which system call is used to create a new process in Unix/Linux?",
    "options": [
      "fork()",
      "exec()",
      "wait()",
      "exit()"
    ],
    "answer": "fork()",
    "topic": "Process Management",
    "subjectId": "OS001",
    "about": "fork() creates a child process by duplicating the parent process."
  },
  {
    "question": "What is the purpose of a semaphore?",
    "options": [
      "Process synchronization",
      "Memory allocation",
      "File storage",
      "CPU cooling"
    ],
    "answer": "Process synchronization",
    "topic": "Synchronization",
    "subjectId": "OS001",
    "about": "Semaphores are used to control access to shared resources."
  },
  {
    "question": "Which scheduling algorithm selects the process with the shortest burst time?",
    "options": [
      "FCFS",
      "Round Robin",
      "SJF",
      "Priority Scheduling"
    ],
    "answer": "SJF",
    "topic": "CPU Scheduling",
    "subjectId": "OS001",
    "about": "Shortest Job First minimizes average waiting time."
  },
  {
    "question": "What is thrashing?",
    "options": [
      "Excessive paging activity",
      "CPU overheating",
      "File corruption",
      "Process termination"
    ],
    "answer": "Excessive paging activity",
    "topic": "Memory Management",
    "subjectId": "OS001",
    "about": "Thrashing occurs when the system spends more time swapping pages than executing processes."
  },
  {
    "question": "Which of the following is a real-time operating system?",
    "options": [
      "Windows 11",
      "Ubuntu",
      "VxWorks",
      "macOS"
    ],
    "answer": "VxWorks",
    "topic": "Types of Operating Systems",
    "subjectId": "OS001",
    "about": "VxWorks is widely used in embedded and real-time systems."
  },
  {
    "question": "What is context switching?",
    "options": [
      "Saving and restoring process states",
      "Deleting a process",
      "Allocating memory",
      "Formatting a disk"
    ],
    "answer": "Saving and restoring process states",
    "topic": "Process Management",
    "subjectId": "OS001",
    "about": "Context switching allows the CPU to switch between multiple processes."
  },
  {
    "question": "Which page replacement algorithm replaces the page that has been in memory the longest?",
    "options": [
      "FIFO",
      "LRU",
      "Optimal",
      "LFU"
    ],
    "answer": "FIFO",
    "topic": "Page Replacement",
    "subjectId": "OS001",
    "about": "FIFO removes the oldest loaded page first."
  },
  {
    "question": "What is a critical section?",
    "options": [
      "A code segment accessing shared resources",
      "A memory block",
      "A CPU register",
      "A file system"
    ],
    "answer": "A code segment accessing shared resources",
    "topic": "Synchronization",
    "subjectId": "OS001",
    "about": "Critical sections require synchronization to avoid race conditions."
  },
  {
    "question": "Which component manages files and directories in an operating system?",
    "options": [
      "File System",
      "Scheduler",
      "Semaphore",
      "Compiler"
    ],
    "answer": "File System",
    "topic": "File Management",
    "subjectId": "OS001",
    "about": "The file system organizes and manages files stored on storage devices."
  },
  {
    "question": "What is the main purpose of multiprogramming?",
    "options": [
      "Increase CPU utilization",
      "Reduce memory size",
      "Increase disk space",
      "Improve monitor resolution"
    ],
    "answer": "Increase CPU utilization",
    "topic": "Operating System Concepts",
    "subjectId": "OS001",
    "about": "Multiprogramming keeps the CPU busy by executing multiple programs concurrently."
  }
]

const cnQuestions = [
  {
    question: "In Go-Back-N ARQ, if the window size is 15 and sequence number is 5 bits, what is the maximum number of packets that can be sent before waiting for ACK?",
    questionImage: "",
    options: ["15", "16", "31", "32"],
    answer: "15",
    topic: "Data Link Layer",
    subjectId: "CN001",
    about: "Go-Back-N ARQ"
  },
  {
    question: "A network has bandwidth of 10 Mbps and one-way propagation delay of 20 ms. What is the bandwidth-delay product?",
    questionImage: "",
    options: ["25 KB", "50 KB", "100 KB", "200 KB"],
    answer: "50 KB",
    topic: "Transport Layer",
    subjectId: "CN001",
    about: "Bandwidth Delay Product"
  },
  {
    question: "Refer to the diagram shown above. Identify the network topology.",
    questionImage: "https://example.com/images/mesh-topology.png",
    options: ["Star Topology", "Bus Topology", "Full Mesh Topology", "Partial Mesh Topology"],
    answer: "Full Mesh Topology",
    topic: "Network Topologies",
    subjectId: "CN001",
    about: "Mesh Topology"
  },
  {
    question: "Which of the following routing protocols is a Path Vector protocol?",
    questionImage: "",
    options: ["OSPF", "RIP", "BGP", "EIGRP"],
    answer: "BGP",
    topic: "Routing",
    subjectId: "CN001",
    about: "BGP Protocol"
  },
  {
    question: "In TCP congestion control, during slow start phase, congestion window increases:",
    questionImage: "",
    options: ["Linearly", "Exponentially", "Logarithmically", "Remains constant"],
    answer: "Exponentially",
    topic: "Transport Layer",
    subjectId: "CN001",
    about: "TCP Congestion Control"
  },
  {
    question: "Longest prefix match is used in:",
    questionImage: "",
    options: ["MAC address lookup", "IP address lookup", "Port number lookup", "Host name resolution"],
    answer: "IP address lookup",
    topic: "Network Layer",
    subjectId: "CN001",
    about: "Routing Table Lookup"
  },
  {
    question: "The diagram above shows TCP connection establishment. If client initial sequence number is 2000, what will be the ACK number sent by server in second packet?",
    questionImage: "https://example.com/images/tcp-3-way-handshake.png",
    options: ["2000", "2001", "0", "4001"],
    answer: "2001",
    topic: "Transport Layer",
    subjectId: "CN001",
    about: "TCP 3-Way Handshake"
  },
  {
    question: "Efficiency of Slotted ALOHA protocol is:",
    questionImage: "",
    options: ["18.4%", "26.8%", "36.8%", "50%"],
    answer: "36.8%",
    topic: "Data Link Layer",
    subjectId: "CN001",
    about: "Slotted ALOHA"
  },
  {
    question: "EIGRP is an example of:",
    questionImage: "",
    options: ["Distance Vector", "Link State", "Hybrid Routing", "Path Vector"],
    answer: "Hybrid Routing",
    topic: "Routing",
    subjectId: "CN001",
    about: "EIGRP"
  },
  {
    question: "Refer to the diagram. Which routing algorithm is shown in the figure?",
    questionImage: "https://example.com/images/distance-vector.png",
    options: ["Link State", "Distance Vector", "Path Vector", "Flooding"],
    answer: "Distance Vector",
    topic: "Routing Algorithms",
    subjectId: "CN001",
    about: "Distance Vector Routing"
  },
  {
    question: "What is the size of TCP header without options?",
    questionImage: "",
    options: ["16 bytes", "20 bytes", "24 bytes", "32 bytes"],
    answer: "20 bytes",
    topic: "Transport Layer",
    subjectId: "CN001",
    about: "TCP Header"
  },
  {
    question: "In IPv6, SLAAC is used for:",
    questionImage: "",
    options: ["Error reporting", "Address autoconfiguration", "Routing", "Fragmentation"],
    answer: "Address autoconfiguration",
    topic: "Network Layer",
    subjectId: "CN001",
    about: "IPv6"
  },
  {
    question: "Refer to the network diagram. How many subnets and hosts per subnet are possible if we use /26 mask on 192.168.10.0/24 network?",
    questionImage: "https://example.com/images/subnetting-diagram.png",
    options: ["4 subnets, 62 hosts", "8 subnets, 30 hosts", "4 subnets, 30 hosts", "8 subnets, 62 hosts"],
    answer: "4 subnets, 62 hosts",
    topic: "Subnetting",
    subjectId: "CN001",
    about: "Subnetting"
  },
  {
    question: "RED (Random Early Detection) is a mechanism for:",
    questionImage: "",
    options: ["Error correction", "Congestion avoidance", "Flow control", "Fragmentation"],
    answer: "Congestion avoidance",
    topic: "Network Layer",
    subjectId: "CN001",
    about: "Congestion Control"
  },
  {
    question: "OSPF is which type of routing protocol?",
    questionImage: "",
    options: ["Distance Vector", "Link State", "Hybrid", "Path Vector"],
    answer: "Link State",
    topic: "Routing",
    subjectId: "CN001",
    about: "OSPF"
  },
  {
    question: "The minimum Hamming distance to detect 'd' errors is:",
    questionImage: "",
    options: ["d", "d+1", "2d", "2d+1"],
    answer: "d+1",
    topic: "Error Control",
    subjectId: "CN001",
    about: "Error Detection"
  },
  {
    question: "What does TTL field in IP header prevent?",
    questionImage: "",
    options: ["Packet loss", "Infinite routing loops", "Congestion", "Fragmentation"],
    answer: "Infinite routing loops",
    topic: "Network Layer",
    subjectId: "CN001",
    about: "IP Header"
  },
  {
    question: "Refer to the header diagram shown above. Which field is used for QoS in IPv4?",
    questionImage: "https://example.com/images/ipv4-header.png",
    options: ["TTL", "Protocol", "Type of Service", "Fragment Offset"],
    answer: "Type of Service",
    topic: "Network Layer",
    subjectId: "CN001",
    about: "IPv4 Header"
  },
  {
    question: "Which of the following is a private IPv4 address range?",
    questionImage: "",
    options: ["12.0.0.0/8", "172.16.0.0/12", "192.0.0.0/8", "224.0.0.0/4"],
    answer: "172.16.0.0/12",
    topic: "IP Addressing",
    subjectId: "CN001",
    about: "Private IP Addresses"
  },
  {
    question: "In Selective Repeat ARQ, the maximum window size with n-bit sequence number is:",
    questionImage: "",
    options: ["2^n", "2^(n-1)", "2^n - 1", "2^(n+1)"],
    answer: "2^(n-1)",
    topic: "Data Link Layer",
    subjectId: "CN001",
    about: "Selective Repeat ARQ"
  }
];

const oopQuestions = [
  {
    question: "What is the main advantage of using Object Oriented Programming over Procedural Programming?",
    questionImage: "",
    options: ["Faster execution", "Better code reusability and maintenance", "Less memory usage", "Easier debugging"],
    answer: "Better code reusability and maintenance",
    topic: "OOP Concepts",
    subjectId: "OOP001",
    about: "OOP vs Procedural"
  },
  {
    question: "Which of the following is not a pillar of Object Oriented Programming?",
    questionImage: "",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Recursion"],
    answer: "Recursion",
    topic: "OOP Concepts",
    subjectId: "OOP001",
    about: "OOP Pillars"
  },
  {
    question: "Encapsulation helps in:",
    questionImage: "",
    options: ["Data hiding", "Code reusability", "Method overriding", "Dynamic binding"],
    answer: "Data hiding",
    topic: "Encapsulation",
    subjectId: "OOP001",
    about: "Encapsulation"
  },
  {
    question: "The ability of an object to take many forms is known as:",
    questionImage: "",
    options: ["Inheritance", "Abstraction", "Polymorphism", "Encapsulation"],
    answer: "Polymorphism",
    topic: "Polymorphism",
    subjectId: "OOP001",
    about: "Polymorphism"
  },
  {
    question: "Which keyword is used to inherit a class in Java?",
    questionImage: "",
    options: ["implements", "extends", "inherits", "super"],
    answer: "extends",
    topic: "Inheritance",
    subjectId: "OOP001",
    about: "Inheritance"
  },
  {
    question: "Method Overloading is resolved at:",
    questionImage: "",
    options: ["Runtime", "Compile time", "Linking time", "Loading time"],
    answer: "Compile time",
    topic: "Polymorphism",
    subjectId: "OOP001",
    about: "Method Overloading"
  },
  {
    question: "Method Overriding is resolved at:",
    questionImage: "",
    options: ["Compile time", "Runtime", "Both", "None"],
    answer: "Runtime",
    topic: "Polymorphism",
    subjectId: "OOP001",
    about: "Method Overriding"
  },
  {
    question: "What is the purpose of a constructor in a class?",
    questionImage: "",
    options: ["To destroy an object", "To initialize an object", "To allocate memory", "To call static methods"],
    answer: "To initialize an object",
    topic: "OOP Basics",
    subjectId: "OOP001",
    about: "Constructor"
  },
  {
    question: "An abstract class can contain:",
    questionImage: "",
    options: ["Only abstract methods", "Only concrete methods", "Both abstract and concrete methods", "Only static methods"],
    answer: "Both abstract and concrete methods",
    topic: "Abstraction",
    subjectId: "OOP001",
    about: "Abstract Class"
  },
  {
    question: "Which access modifier is most restrictive?",
    questionImage: "",
    options: ["public", "protected", "default", "private"],
    answer: "private",
    topic: "OOP Concepts",
    subjectId: "OOP001",
    about: "Access Modifiers"
  },
  {
    question: "'super' keyword is used to:",
    questionImage: "",
    options: ["Call parent class constructor", "Call current class method", "Access private members", "Create object"],
    answer: "Call parent class constructor",
    topic: "Inheritance",
    subjectId: "OOP001",
    about: "super Keyword"
  },
  {
    question: "Composition represents ________ relationship between classes.",
    questionImage: "",
    options: ["Is-A", "Has-A", "Like-A", "Part-Of"],
    answer: "Has-A",
    topic: "OOP Concepts",
    subjectId: "OOP001",
    about: "Composition"
  },
  {
    question: "Which of the following supports multiple inheritance in Java?",
    questionImage: "",
    options: ["Classes", "Interfaces", "Abstract Classes", "Final Classes"],
    answer: "Interfaces",
    topic: "Inheritance",
    subjectId: "OOP001",
    about: "Multiple Inheritance"
  },
  {
    question: "A class cannot be declared as:",
    questionImage: "",
    options: ["Abstract", "Final", "Public", "Static"],
    answer: "Static",
    topic: "OOP Concepts",
    subjectId: "OOP001",
    about: "Class Modifiers"
  },
  {
    question: "What is the default value of reference variable in Java?",
    questionImage: "",
    options: ["null", "0", "undefined", "garbage value"],
    answer: "null",
    topic: "OOP Basics",
    subjectId: "OOP001",
    about: "Reference Variable"
  },
  {
    question: "Final method in a class can be:",
    questionImage: "",
    options: ["Overloaded", "Overridden", "Both", "None"],
    answer: "Overloaded",
    topic: "Polymorphism",
    subjectId: "OOP001",
    about: "final Keyword"
  },
  {
    question: "Which concept is used to achieve runtime polymorphism?",
    questionImage: "",
    options: ["Method Overloading", "Method Overriding", "Operator Overloading", "Constructor Overloading"],
    answer: "Method Overriding",
    topic: "Polymorphism",
    subjectId: "OOP001",
    about: "Runtime Polymorphism"
  },
  {
    question: "Interface in Java is used to achieve:",
    questionImage: "",
    options: ["Multiple Inheritance", "Data Hiding", "Encapsulation", "Abstraction"],
    answer: "Multiple Inheritance",
    topic: "Abstraction",
    subjectId: "OOP001",
    about: "Interface"
  },
  {
    question: "this() and super() can be used in:",
    questionImage: "",
    options: ["Any method", "Only constructor", "Only static block", "Only main method"],
    answer: "Only constructor",
    topic: "OOP Basics",
    subjectId: "OOP001",
    about: "Constructor Chaining"
  },
  {
    question: "Which principle says 'A class should have only one reason to change'?",
    questionImage: "",
    options: ["Single Responsibility Principle", "Open Closed Principle", "Liskov Substitution", "Dependency Inversion"],
    answer: "Single Responsibility Principle",
    topic: "OOP Design",
    subjectId: "OOP001",
    about: "SOLID Principle"
  }
];