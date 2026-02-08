import { clsx } from 'clsx';

// Utility functions for the application

// Conditional class names
export const cn = (...inputs) => clsx(inputs);

// Generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return 'Never';
  
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return d.toLocaleDateString();
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Hard':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'Done':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Todo':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Revising':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Keyboard shortcuts
export const keyboardShortcuts = {
  // Global shortcuts
  'Ctrl+K': 'focusSearch',
  'Ctrl+N': 'newTopic',
  'Escape': 'clearSelection',
  
  // Navigation
  'ArrowUp': 'navigateUp',
  'ArrowDown': 'navigateDown',
  'ArrowLeft': 'navigateLeft',
  'ArrowRight': 'navigateRight',
  
  // Actions
  'Enter': 'confirmAction',
  'Delete': 'deleteItem',
  'F2': 'editItem',
  'Ctrl+Z': 'undo',
  'Ctrl+Y': 'redo',
  
  // Filters
  'Ctrl+1': 'filterEasy',
  'Ctrl+2': 'filterMedium',
  'Ctrl+3': 'filterHard',
  'Ctrl+0': 'clearFilters'
};

// Check if keyboard shortcut matches
export const matchesShortcut = (event, shortcut) => {
  const keys = shortcut.toLowerCase().split('+');
  const ctrl = keys.includes('ctrl');
  const shift = keys.includes('shift');
  const alt = keys.includes('alt');
  const key = keys[keys.length - 1];
  
  if (ctrl && !event.ctrlKey) return false;
  if (shift && !event.shiftKey) return false;
  if (alt && !event.altKey) return false;
  
  return event.key.toLowerCase() === key;
};

// Calculate progress percentage
export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Generate sample data for development
export const generateSampleData = () => {
  const topics = [
    {
      _id: 'topic1',
      title: 'Arrays & Strings',
      description: 'Fundamental data structures and string manipulation',
      order: 0,
      color: '#3B82F6'
    },
    {
      _id: 'topic2',
      title: 'Linked Lists',
      description: 'Singly and doubly linked lists',
      order: 1,
      color: '#10B981'
    },
    {
      _id: 'topic3',
      title: 'Trees & Graphs',
      description: 'Binary trees, BST, and graph algorithms',
      order: 2,
      color: '#F59E0B'
    }
  ];
  
  const subTopics = [
    {
      _id: 'sub1',
      title: 'Basic Array Operations',
      topicId: 'topic1',
      order: 0
    },
    {
      _id: 'sub2',
      title: 'Two Pointers',
      topicId: 'topic1',
      order: 1
    },
    {
      _id: 'sub3',
      title: 'Singly Linked List',
      topicId: 'topic2',
      order: 0
    },
    {
      _id: 'sub4',
      title: 'Binary Trees',
      topicId: 'topic3',
      order: 0
    }
  ];
  
  const questions = [
    {
      _id: 'q1',
      title: 'Two Sum',
      description: 'Find two numbers that add up to target',
      subTopicId: 'sub1',
      difficulty: 'Easy',
      status: 'Done',
      order: 0,
      tags: ['array', 'hash-table']
    },
    {
      _id: 'q2',
      title: 'Container With Most Water',
      description: 'Find max area using two pointers',
      subTopicId: 'sub2',
      difficulty: 'Medium',
      status: 'Todo',
      order: 0,
      tags: ['two-pointers', 'array']
    },
    {
      _id: 'q3',
      title: 'Reverse Linked List',
      description: 'Reverse a singly linked list',
      subTopicId: 'sub3',
      difficulty: 'Easy',
      status: 'Done',
      order: 0,
      tags: ['linked-list']
    },
    {
      _id: 'q4',
      title: 'Maximum Depth of Binary Tree',
      description: 'Find the maximum depth of a binary tree',
      subTopicId: 'sub4',
      difficulty: 'Easy',
      status: 'Revising',
      order: 0,
      tags: ['tree', 'recursion']
    }
  ];
  
  return { topics, subTopics, questions };
};

// Export constants
export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
export const STATUS_OPTIONS = ['Todo', 'Done', 'Revising'];
export const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
];
