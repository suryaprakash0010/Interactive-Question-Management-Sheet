// Mock data for development without MongoDB
const mockTopics = [
  {
    _id: 'topic1',
    title: 'Arrays & Strings',
    description: 'Fundamental data structures and string manipulation problems',
    color: '#3B82F6',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'topic2',
    title: 'Linked Lists',
    description: 'Singly and doubly linked list operations and problems',
    color: '#10B981',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'topic3',
    title: 'Trees & Graphs',
    description: 'Binary trees, BST, graph traversal and algorithms',
    color: '#F59E0B',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'topic4',
    title: 'Dynamic Programming',
    description: 'DP patterns and optimization problems',
    color: '#EF4444',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'topic5',
    title: 'Sorting & Searching',
    description: 'Various sorting algorithms and search techniques',
    color: '#8B5CF6',
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockSubTopics = [
  {
    _id: 'sub1',
    title: 'Basic Array Operations',
    topicId: 'topic1',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub2',
    title: 'Two Pointers',
    topicId: 'topic1',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub3',
    title: 'Sliding Window',
    topicId: 'topic1',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub4',
    title: 'String Manipulation',
    topicId: 'topic1',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub5',
    title: 'Singly Linked List',
    topicId: 'topic2',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub6',
    title: 'Doubly Linked List',
    topicId: 'topic2',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub7',
    title: 'Circular Linked List',
    topicId: 'topic2',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub8',
    title: 'Binary Trees',
    topicId: 'topic3',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub9',
    title: 'Binary Search Trees',
    topicId: 'topic3',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub10',
    title: 'Graph Traversal',
    topicId: 'topic3',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub11',
    title: 'Shortest Path',
    topicId: 'topic3',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub12',
    title: '1D DP',
    topicId: 'topic4',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub13',
    title: '2D DP',
    topicId: 'topic4',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub14',
    title: 'Memoization',
    topicId: 'topic4',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub15',
    title: 'Basic Sorting',
    topicId: 'topic5',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub16',
    title: 'Advanced Sorting',
    topicId: 'topic5',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'sub17',
    title: 'Binary Search',
    topicId: 'topic5',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockQuestions = [
  // Arrays & Strings - Basic Array Operations
  {
    _id: 'q1',
    title: 'Two Sum',
    description: 'Find two numbers that add up to a specific target',
    subTopicId: 'sub1',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['array', 'hash-table'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q2',
    title: 'Best Time to Buy and Sell Stock',
    description: 'Find maximum profit from stock prices',
    subTopicId: 'sub1',
    difficulty: 'Easy',
    status: 'Done',
    order: 1,
    tags: ['array', 'dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q3',
    title: 'Contains Duplicate',
    description: 'Check if array contains any duplicates',
    subTopicId: 'sub1',
    difficulty: 'Easy',
    status: 'Todo',
    order: 2,
    tags: ['array', 'hash-table'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q4',
    title: 'Product of Array Except Self',
    description: 'Find product of all elements except self',
    subTopicId: 'sub1',
    difficulty: 'Medium',
    status: 'Todo',
    order: 3,
    tags: ['array', 'math'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Arrays & Strings - Two Pointers
  {
    _id: 'q5',
    title: 'Container With Most Water',
    description: 'Find container with most water using two pointers',
    subTopicId: 'sub2',
    difficulty: 'Medium',
    status: 'Todo',
    order: 0,
    tags: ['array', 'two-pointers'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q6',
    title: '3Sum',
    description: 'Find triplets that sum to zero',
    subTopicId: 'sub2',
    difficulty: 'Medium',
    status: 'Revising',
    order: 1,
    tags: ['array', 'two-pointers'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q7',
    title: 'Remove Duplicates from Sorted Array',
    description: 'Remove duplicates in-place from sorted array',
    subTopicId: 'sub2',
    difficulty: 'Easy',
    status: 'Done',
    order: 2,
    tags: ['array', 'two-pointers'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Arrays & Strings - Sliding Window
  {
    _id: 'q8',
    title: 'Maximum Subarray',
    description: 'Find contiguous subarray with largest sum',
    subTopicId: 'sub3',
    difficulty: 'Medium',
    status: 'Done',
    order: 0,
    tags: ['array', 'sliding-window'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q9',
    title: 'Longest Substring Without Repeating Characters',
    description: 'Find longest substring without repeating characters',
    subTopicId: 'sub3',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['string', 'sliding-window'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q10',
    title: 'Minimum Window Substring',
    description: 'Find minimum window containing all characters',
    subTopicId: 'sub3',
    difficulty: 'Hard',
    status: 'Todo',
    order: 2,
    tags: ['string', 'sliding-window'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Arrays & Strings - String Manipulation
  {
    _id: 'q11',
    title: 'Valid Parentheses',
    description: 'Check if parentheses are valid',
    subTopicId: 'sub4',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['string', 'stack'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q12',
    title: 'Longest Palindromic Substring',
    description: 'Find longest palindromic substring',
    subTopicId: 'sub4',
    difficulty: 'Medium',
    status: 'Revising',
    order: 1,
    tags: ['string', 'dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Linked Lists - Singly Linked List
  {
    _id: 'q13',
    title: 'Reverse Linked List',
    description: 'Reverse a singly linked list',
    subTopicId: 'sub5',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['linked-list'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q14',
    title: 'Merge Two Sorted Lists',
    description: 'Merge two sorted linked lists',
    subTopicId: 'sub5',
    difficulty: 'Easy',
    status: 'Done',
    order: 1,
    tags: ['linked-list'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q15',
    title: 'Linked List Cycle',
    description: 'Detect if linked list has cycle',
    subTopicId: 'sub5',
    difficulty: 'Easy',
    status: 'Todo',
    order: 2,
    tags: ['linked-list', 'two-pointers'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q16',
    title: 'Add Two Numbers',
    description: 'Add two numbers represented by linked lists',
    subTopicId: 'sub5',
    difficulty: 'Medium',
    status: 'Todo',
    order: 3,
    tags: ['linked-list', 'math'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Linked Lists - Doubly Linked List
  {
    _id: 'q17',
    title: 'Design Browser History',
    description: 'Implement browser history with doubly linked list',
    subTopicId: 'sub6',
    difficulty: 'Medium',
    status: 'Todo',
    order: 0,
    tags: ['linked-list', 'design'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q18',
    title: 'Flatten Nested List Iterator',
    description: 'Flatten nested linked list structure',
    subTopicId: 'sub6',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['linked-list', 'recursion'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Trees & Graphs - Binary Trees
  {
    _id: 'q19',
    title: 'Maximum Depth of Binary Tree',
    description: 'Find maximum depth of binary tree',
    subTopicId: 'sub8',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['tree', 'recursion'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q20',
    title: 'Same Tree',
    description: 'Check if two trees are identical',
    subTopicId: 'sub8',
    difficulty: 'Easy',
    status: 'Done',
    order: 1,
    tags: ['tree', 'recursion'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q21',
    title: 'Invert Binary Tree',
    description: 'Invert a binary tree',
    subTopicId: 'sub8',
    difficulty: 'Easy',
    status: 'Todo',
    order: 2,
    tags: ['tree', 'recursion'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q22',
    title: 'Validate Binary Search Tree',
    description: 'Check if tree is a valid BST',
    subTopicId: 'sub9',
    difficulty: 'Medium',
    status: 'Revising',
    order: 0,
    tags: ['tree', 'bst'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q23',
    title: 'Kth Smallest Element in BST',
    description: 'Find kth smallest element in BST',
    subTopicId: 'sub9',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['tree', 'bst'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Trees & Graphs - Graph Traversal
  {
    _id: 'q24',
    title: 'Number of Islands',
    description: 'Count number of islands in grid',
    subTopicId: 'sub10',
    difficulty: 'Medium',
    status: 'Done',
    order: 0,
    tags: ['graph', 'dfs', 'bfs'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q25',
    title: 'Clone Graph',
    description: 'Clone a connected undirected graph',
    subTopicId: 'sub10',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['graph', 'dfs'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q26',
    title: 'Course Schedule',
    description: 'Check if you can finish all courses',
    subTopicId: 'sub10',
    difficulty: 'Medium',
    status: 'Revising',
    order: 2,
    tags: ['graph', 'topological-sort'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Trees & Graphs - Shortest Path
  {
    _id: 'q27',
    title: 'Dijkstra Algorithm',
    description: 'Find shortest path in weighted graph',
    subTopicId: 'sub11',
    difficulty: 'Hard',
    status: 'Todo',
    order: 0,
    tags: ['graph', 'shortest-path'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q28',
    title: 'Bellman-Ford Algorithm',
    description: 'Find shortest paths with negative edges',
    subTopicId: 'sub11',
    difficulty: 'Hard',
    status: 'Todo',
    order: 1,
    tags: ['graph', 'shortest-path'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Dynamic Programming - 1D DP
  {
    _id: 'q29',
    title: 'Climbing Stairs',
    description: 'Number of ways to climb stairs',
    subTopicId: 'sub12',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q30',
    title: 'House Robber',
    description: 'Maximum money that can be robbed',
    subTopicId: 'sub12',
    difficulty: 'Medium',
    status: 'Revising',
    order: 1,
    tags: ['dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q31',
    title: 'Coin Change',
    description: 'Minimum number of coins for amount',
    subTopicId: 'sub12',
    difficulty: 'Medium',
    status: 'Todo',
    order: 2,
    tags: ['dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Dynamic Programming - 2D DP
  {
    _id: 'q32',
    title: 'Unique Paths',
    description: 'Number of unique paths in grid',
    subTopicId: 'sub13',
    difficulty: 'Medium',
    status: 'Todo',
    order: 0,
    tags: ['dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q33',
    title: 'Minimum Path Sum',
    description: 'Minimum path sum in grid',
    subTopicId: 'sub13',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['dynamic-programming'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q34',
    title: 'Edit Distance',
    description: 'Minimum operations to convert strings',
    subTopicId: 'sub14',
    difficulty: 'Hard',
    status: 'Todo',
    order: 0,
    tags: ['dynamic-programming', 'string'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Sorting & Searching - Basic Sorting
  {
    _id: 'q35',
    title: 'Merge Sorted Array',
    description: 'Merge two sorted arrays in-place',
    subTopicId: 'sub15',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['array', 'sorting'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q36',
    title: 'Sort Colors',
    description: 'Sort colors with one-pass algorithm',
    subTopicId: 'sub15',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['array', 'sorting'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Sorting & Searching - Advanced Sorting
  {
    _id: 'q37',
    title: 'Quick Sort',
    description: 'Implement quick sort algorithm',
    subTopicId: 'sub16',
    difficulty: 'Medium',
    status: 'Todo',
    order: 0,
    tags: ['sorting', 'divide-and-conquer'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q38',
    title: 'Heap Sort',
    description: 'Implement heap sort algorithm',
    subTopicId: 'sub16',
    difficulty: 'Medium',
    status: 'Todo',
    order: 1,
    tags: ['sorting', 'heap'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Sorting & Searching - Binary Search
  {
    _id: 'q39',
    title: 'Binary Search',
    description: 'Implement binary search algorithm',
    subTopicId: 'sub17',
    difficulty: 'Easy',
    status: 'Done',
    order: 0,
    tags: ['array', 'binary-search'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q40',
    title: 'Search Insert Position',
    description: 'Find insert position in sorted array',
    subTopicId: 'sub17',
    difficulty: 'Easy',
    status: 'Todo',
    order: 1,
    tags: ['array', 'binary-search'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'q41',
    title: 'Search in Rotated Sorted Array',
    description: 'Search in rotated sorted array',
    subTopicId: 'sub17',
    difficulty: 'Medium',
    status: 'Todo',
    order: 2,
    tags: ['array', 'binary-search'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  mockTopics,
  mockSubTopics,
  mockQuestions
};
