const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const SubTopic = require('./models/SubTopic');
const Question = require('./models/Question');
require('dotenv').config();

const sampleData = {
  topics: [
    {
      title: 'Arrays & Strings',
      description: 'Fundamental data structures and string manipulation problems',
      color: '#3B82F6',
      order: 0
    },
    {
      title: 'Linked Lists',
      description: 'Singly and doubly linked list operations and problems',
      color: '#10B981',
      order: 1
    },
    {
      title: 'Trees & Graphs',
      description: 'Binary trees, BST, graph traversal and algorithms',
      color: '#F59E0B',
      order: 2
    },
    {
      title: 'Dynamic Programming',
      description: 'DP patterns and optimization problems',
      color: '#EF4444',
      order: 3
    },
    {
      title: 'Sorting & Searching',
      description: 'Various sorting algorithms and search techniques',
      color: '#8B5CF6',
      order: 4
    }
  ],
  subTopics: [
    // Arrays & Strings
    { title: 'Basic Array Operations', topicIndex: 0, order: 0 },
    { title: 'Two Pointers', topicIndex: 0, order: 1 },
    { title: 'Sliding Window', topicIndex: 0, order: 2 },
    { title: 'String Manipulation', topicIndex: 0, order: 3 },
    
    // Linked Lists
    { title: 'Singly Linked List', topicIndex: 1, order: 0 },
    { title: 'Doubly Linked List', topicIndex: 1, order: 1 },
    { title: 'Circular Linked List', topicIndex: 1, order: 2 },
    
    // Trees & Graphs
    { title: 'Binary Trees', topicIndex: 2, order: 0 },
    { title: 'Binary Search Trees', topicIndex: 2, order: 1 },
    { title: 'Graph Traversal', topicIndex: 2, order: 2 },
    { title: 'Shortest Path', topicIndex: 2, order: 3 },
    
    // Dynamic Programming
    { title: '1D DP', topicIndex: 3, order: 0 },
    { title: '2D DP', topicIndex: 3, order: 1 },
    { title: 'Memoization', topicIndex: 3, order: 2 },
    
    // Sorting & Searching
    { title: 'Basic Sorting', topicIndex: 4, order: 0 },
    { title: 'Advanced Sorting', topicIndex: 4, order: 1 },
    { title: 'Binary Search', topicIndex: 4, order: 2 }
  ],
  questions: [
    // Arrays & Strings - Basic Array Operations
    { title: 'Two Sum', subTopicIndex: 0, difficulty: 'Easy', status: 'Done', description: 'Find two numbers that add up to a specific target', tags: ['array', 'hash-table'] },
    { title: 'Best Time to Buy and Sell Stock', subTopicIndex: 0, difficulty: 'Easy', status: 'Done', description: 'Find the maximum profit from stock prices', tags: ['array', 'dynamic-programming'] },
    { title: 'Contains Duplicate', subTopicIndex: 0, difficulty: 'Easy', status: 'Todo', description: 'Check if array contains any duplicates', tags: ['array', 'hash-table'] },
    
    // Arrays & Strings - Two Pointers
    { title: 'Container With Most Water', subTopicIndex: 1, difficulty: 'Medium', status: 'Todo', description: 'Find container with most water using two pointers', tags: ['array', 'two-pointers'] },
    { title: '3Sum', subTopicIndex: 1, difficulty: 'Medium', status: 'Revising', description: 'Find triplets that sum to zero', tags: ['array', 'two-pointers'] },
    { title: 'Remove Duplicates from Sorted Array', subTopicIndex: 1, difficulty: 'Easy', status: 'Done', description: 'Remove duplicates in-place', tags: ['array', 'two-pointers'] },
    
    // Arrays & Strings - Sliding Window
    { title: 'Maximum Subarray', subTopicIndex: 2, difficulty: 'Medium', status: 'Done', description: 'Find the contiguous subarray with largest sum', tags: ['array', 'sliding-window'] },
    { title: 'Sliding Window Maximum', subTopicIndex: 2, difficulty: 'Hard', status: 'Todo', description: 'Find maximum in each sliding window', tags: ['array', 'sliding-window', 'deque'] },
    
    // Arrays & Strings - String Manipulation
    { title: 'Valid Parentheses', subTopicIndex: 3, difficulty: 'Easy', status: 'Done', description: 'Check if parentheses are valid', tags: ['string', 'stack'] },
    { title: 'Longest Substring Without Repeating Characters', subTopicIndex: 3, difficulty: 'Medium', status: 'Revising', description: 'Find longest substring without repeating characters', tags: ['string', 'sliding-window'] },
    
    // Linked Lists - Singly Linked List
    { title: 'Reverse Linked List', subTopicIndex: 4, difficulty: 'Easy', status: 'Done', description: 'Reverse a singly linked list', tags: ['linked-list'] },
    { title: 'Merge Two Sorted Lists', subTopicIndex: 4, difficulty: 'Easy', status: 'Done', description: 'Merge two sorted linked lists', tags: ['linked-list'] },
    { title: 'Linked List Cycle', subTopicIndex: 4, difficulty: 'Easy', status: 'Todo', description: 'Detect if linked list has cycle', tags: ['linked-list', 'two-pointers'] },
    
    // Linked Lists - Doubly Linked List
    { title: 'Design Browser History', subTopicIndex: 5, difficulty: 'Medium', status: 'Todo', description: 'Implement browser history with doubly linked list', tags: ['linked-list', 'design'] },
    
    // Trees & Graphs - Binary Trees
    { title: 'Maximum Depth of Binary Tree', subTopicIndex: 7, difficulty: 'Easy', status: 'Done', description: 'Find maximum depth of binary tree', tags: ['tree', 'recursion'] },
    { title: 'Same Tree', subTopicIndex: 7, difficulty: 'Easy', status: 'Done', description: 'Check if two trees are identical', tags: ['tree', 'recursion'] },
    { title: 'Invert Binary Tree', subTopicIndex: 7, difficulty: 'Easy', status: 'Todo', description: 'Invert a binary tree', tags: ['tree', 'recursion'] },
    
    // Trees & Graphs - Binary Search Trees
    { title: 'Validate Binary Search Tree', subTopicIndex: 8, difficulty: 'Medium', status: 'Revising', description: 'Check if tree is a valid BST', tags: ['tree', 'bst'] },
    { title: 'Kth Smallest Element in BST', subTopicIndex: 8, difficulty: 'Medium', status: 'Todo', description: 'Find kth smallest element in BST', tags: ['tree', 'bst'] },
    
    // Trees & Graphs - Graph Traversal
    { title: 'Number of Islands', subTopicIndex: 9, difficulty: 'Medium', status: 'Done', description: 'Count number of islands in grid', tags: ['graph', 'dfs', 'bfs'] },
    { title: 'Clone Graph', subTopicIndex: 9, difficulty: 'Medium', status: 'Todo', description: 'Clone a connected undirected graph', tags: ['graph', 'dfs'] },
    
    // Dynamic Programming - 1D DP
    { title: 'Climbing Stairs', subTopicIndex: 11, difficulty: 'Easy', status: 'Done', description: 'Number of ways to climb stairs', tags: ['dynamic-programming'] },
    { title: 'House Robber', subTopicIndex: 11, difficulty: 'Medium', status: 'Revising', description: 'Maximum money that can be robbed', tags: ['dynamic-programming'] },
    
    // Dynamic Programming - 2D DP
    { title: 'Unique Paths', subTopicIndex: 12, difficulty: 'Medium', status: 'Todo', description: 'Number of unique paths in grid', tags: ['dynamic-programming'] },
    { title: 'Minimum Path Sum', subTopicIndex: 12, difficulty: 'Medium', status: 'Todo', description: 'Minimum path sum in grid', tags: ['dynamic-programming'] },
    
    // Sorting & Searching - Basic Sorting
    { title: 'Merge Sorted Array', subTopicIndex: 14, difficulty: 'Easy', status: 'Done', description: 'Merge two sorted arrays in-place', tags: ['array', 'sorting'] },
    
    // Sorting & Searching - Binary Search
    { title: 'Binary Search', subTopicIndex: 16, difficulty: 'Easy', status: 'Done', description: 'Implement binary search', tags: ['array', 'binary-search'] },
    { title: 'Search Insert Position', subTopicIndex: 16, difficulty: 'Easy', status: 'Todo', description: 'Find insert position in sorted array', tags: ['array', 'binary-search'] }
  ]
};

async function seedDatabase() {
  try {
    // Clear existing data
    await Topic.deleteMany({});
    await SubTopic.deleteMany({});
    await Question.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert topics
    const createdTopics = await Topic.insertMany(sampleData.topics);
    console.log(`Created ${createdTopics.length} topics`);
    
    // Insert subtopics with topic IDs
    const subTopicsWithIds = sampleData.subTopics.map(st => ({
      ...st,
      topicId: createdTopics[st.topicIndex]._id
    }));
    
    const createdSubTopics = await SubTopic.insertMany(subTopicsWithIds);
    console.log(`Created ${createdSubTopics.length} subtopics`);
    
    // Insert questions with subtopic IDs
    const questionsWithIds = sampleData.questions.map(q => ({
      ...q,
      subTopicId: createdSubTopics[q.subTopicIndex]._id
    }));
    
    const createdQuestions = await Question.insertMany(questionsWithIds);
    console.log(`Created ${createdQuestions.length} questions`);
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seeder
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
