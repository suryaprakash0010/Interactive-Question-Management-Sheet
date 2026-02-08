const express = require('express');
const router = express.Router();
const { mockTopics, mockSubTopics, mockQuestions } = require('../mockData');

// Simulate network latency
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GET all subtopics with their questions
router.get('/', async (req, res) => {
  try {
    await delay();
    
    const { topicId } = req.query;
    const filter = topicId ? { topicId } : {};
    
    let filteredSubTopics = mockSubTopics;
    if (topicId) {
      filteredSubTopics = mockSubTopics.filter(st => st.topicId === topicId);
    }
    
    const subTopicsWithQuestions = filteredSubTopics.map(subTopic => {
      const questions = mockQuestions.filter(q => q.subTopicId === subTopic._id);
      return {
        ...subTopic,
        questions
      };
    });
    
    res.json(subTopicsWithQuestions);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).json({ error: 'Failed to fetch subtopics' });
  }
});

// GET single subtopic
router.get('/:id', async (req, res) => {
  try {
    await delay();
    
    const subTopic = mockSubTopics.find(st => st._id === req.params.id);
    if (!subTopic) {
      return res.status(404).json({ error: 'SubTopic not found' });
    }
    
    res.json(subTopic);
  } catch (error) {
    console.error('Error fetching subtopic:', error);
    res.status(500).json({ error: 'Failed to fetch subtopic' });
  }
});

// POST create new subtopic
router.post('/', async (req, res) => {
  try {
    await delay();
    
    const { title, description, topicId } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!topicId) {
      return res.status(400).json({ error: 'Topic ID is required' });
    }
    
    const topicExists = mockTopics.some(t => t._id === topicId);
    if (!topicExists) {
      return res.status(400).json({ error: 'Topic not found' });
    }
    
    const newSubTopic = {
      _id: 'sub' + Date.now(),
      title: title.trim(),
      description: description?.trim() || '',
      topicId,
      order: mockSubTopics.filter(st => st.topicId === topicId).length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockSubTopics.push(newSubTopic);
    res.status(201).json(newSubTopic);
  } catch (error) {
    console.error('Error creating subtopic:', error);
    res.status(500).json({ error: 'Failed to create subtopic' });
  }
});

// PUT update subtopic
router.put('/:id', async (req, res) => {
  try {
    await delay();
    
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const subTopicIndex = mockSubTopics.findIndex(st => st._id === req.params.id);
    if (subTopicIndex === -1) {
      return res.status(404).json({ error: 'SubTopic not found' });
    }
    
    mockSubTopics[subTopicIndex] = {
      ...mockSubTopics[subTopicIndex],
      title: title.trim(),
      description: description?.trim() || '',
      updatedAt: new Date()
    };
    
    res.json(mockSubTopics[subTopicIndex]);
  } catch (error) {
    console.error('Error updating subtopic:', error);
    res.status(500).json({ error: 'Failed to update subtopic' });
  }
});

// DELETE subtopic
router.delete('/:id', async (req, res) => {
  try {
    await delay();
    
    const subTopicIndex = mockSubTopics.findIndex(st => st._id === req.params.id);
    if (subTopicIndex === -1) {
      return res.status(404).json({ error: 'SubTopic not found' });
    }
    
    mockSubTopics.splice(subTopicIndex, 1);
    
    // Delete associated questions
    mockQuestions.splice(0, mockQuestions.length,
      ...mockQuestions.filter(q => q.subTopicId !== req.params.id)
    );
    
    res.json({ message: 'SubTopic deleted successfully' });
  } catch (error) {
    console.error('Error deleting subtopic:', error);
    res.status(500).json({ error: 'Failed to delete subtopic' });
  }
});

// PUT reorder subtopics
router.put('/reorder', async (req, res) => {
  try {
    await delay();
    
    const { subTopics } = req.body;
    
    if (!Array.isArray(subTopics)) {
      return res.status(400).json({ error: 'SubTopics array is required' });
    }
    
    // Update order for each subtopic
    subTopics.forEach(({ id, order }) => {
      const subTopicIndex = mockSubTopics.findIndex(st => st._id === id);
      if (subTopicIndex !== -1) {
        mockSubTopics[subTopicIndex].order = order;
      }
    });
    
    res.json({ message: 'SubTopics reordered successfully' });
  } catch (error) {
    console.error('Error reordering subtopics:', error);
    res.status(500).json({ error: 'Failed to reorder subtopics' });
  }
});

module.exports = router;
