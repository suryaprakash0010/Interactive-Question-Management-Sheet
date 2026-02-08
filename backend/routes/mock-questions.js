const express = require('express');
const router = express.Router();
const { mockTopics, mockSubTopics, mockQuestions } = require('../mockData');

// Simulate network latency
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GET all questions
router.get('/', async (req, res) => {
  try {
    await delay();
    
    const { subTopicId, difficulty, status, search } = req.query;
    let filteredQuestions = [...mockQuestions];
    
    if (subTopicId) {
      filteredQuestions = filteredQuestions.filter(q => q.subTopicId === subTopicId);
    }
    
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }
    
    if (status) {
      filteredQuestions = filteredQuestions.filter(q => q.status === status);
    }
    
    if (search) {
      const query = search.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Add subtopic info
    const questionsWithSubTopic = filteredQuestions.map(question => {
      const subTopic = mockSubTopics.find(st => st._id === question.subTopicId);
      return {
        ...question,
        subTopicId: subTopic ? { _id: subTopic._id, title: subTopic.title } : question.subTopicId
      };
    });
    
    res.json(questionsWithSubTopic);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET single question
router.get('/:id', async (req, res) => {
  try {
    await delay();
    
    const question = mockQuestions.find(q => q._id === req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Add subtopic info
    const subTopic = mockSubTopics.find(st => st._id === question.subTopicId);
    const questionWithSubTopic = {
      ...question,
      subTopicId: subTopic ? { _id: subTopic._id, title: subTopic.title } : question.subTopicId
    };
    
    res.json(questionWithSubTopic);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// POST create new question
router.post('/', async (req, res) => {
  try {
    await delay();
    
    const { title, description, subTopicId, difficulty, status, tags } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!subTopicId) {
      return res.status(400).json({ error: 'SubTopic ID is required' });
    }
    
    const subTopicExists = mockSubTopics.some(st => st._id === subTopicId);
    if (!subTopicExists) {
      return res.status(400).json({ error: 'SubTopic not found' });
    }
    
    const newQuestion = {
      _id: 'q' + Date.now(),
      title: title.trim(),
      description: description?.trim() || '',
      subTopicId,
      difficulty: difficulty || 'Medium',
      status: status || 'Todo',
      tags: tags || [],
      order: mockQuestions.filter(q => q.subTopicId === subTopicId).length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockQuestions.push(newQuestion);
    
    // Add subtopic info for response
    const subTopic = mockSubTopics.find(st => st._id === subTopicId);
    const questionWithSubTopic = {
      ...newQuestion,
      subTopicId: subTopic ? { _id: subTopic._id, title: subTopic.title } : newQuestion.subTopicId
    };
    
    res.status(201).json(questionWithSubTopic);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// PUT update question
router.put('/:id', async (req, res) => {
  try {
    await delay();
    
    const { title, description, difficulty, status, tags } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const questionIndex = mockQuestions.findIndex(q => q._id === req.params.id);
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    mockQuestions[questionIndex] = {
      ...mockQuestions[questionIndex],
      title: title.trim(),
      description: description?.trim() || '',
      difficulty: difficulty || 'Medium',
      status: status || 'Todo',
      tags: tags || [],
      updatedAt: new Date()
    };
    
    // Add subtopic info for response
    const subTopic = mockSubTopics.find(st => st._id === mockQuestions[questionIndex].subTopicId);
    const questionWithSubTopic = {
      ...mockQuestions[questionIndex],
      subTopicId: subTopic ? { _id: subTopic._id, title: subTopic.title } : mockQuestions[questionIndex].subTopicId
    };
    
    res.json(questionWithSubTopic);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// DELETE question
router.delete('/:id', async (req, res) => {
  try {
    await delay();
    
    const questionIndex = mockQuestions.findIndex(q => q._id === req.params.id);
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    mockQuestions.splice(questionIndex, 1);
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// PUT reorder questions
router.put('/reorder', async (req, res) => {
  try {
    await delay();
    
    const { questions } = req.body;
    
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions array is required' });
    }
    
    // Update order for each question
    questions.forEach(({ id, order }) => {
      const questionIndex = mockQuestions.findIndex(q => q._id === id);
      if (questionIndex !== -1) {
        mockQuestions[questionIndex].order = order;
      }
    });
    
    res.json({ message: 'Questions reordered successfully' });
  } catch (error) {
    console.error('Error reordering questions:', error);
    res.status(500).json({ error: 'Failed to reorder questions' });
  }
});

// GET search questions across all topics
router.get('/search/global', async (req, res) => {
  try {
    await delay();
    
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const query = q.toLowerCase();
    const filteredQuestions = mockQuestions.filter(q =>
      q.title.toLowerCase().includes(query) ||
      q.description.toLowerCase().includes(query) ||
      q.tags?.some(tag => tag.toLowerCase().includes(query))
    );
    
    // Add subtopic info
    const questionsWithSubTopic = filteredQuestions.map(question => {
      const subTopic = mockSubTopics.find(st => st._id === question.subTopicId);
      return {
        ...question,
        subTopicId: subTopic ? { _id: subTopic._id, title: subTopic.title } : question.subTopicId
      };
    });
    
    res.json(questionsWithSubTopic);
  } catch (error) {
    console.error('Error searching questions:', error);
    res.status(500).json({ error: 'Failed to search questions' });
  }
});

module.exports = router;
