const express = require('express');
const router = express.Router();
const { mockTopics, mockSubTopics, mockQuestions } = require('../mockData');

// Simulate network latency
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GET all topics with their subtopics and questions
router.get('/', async (req, res) => {
  try {
    await delay();
    
    const topicsWithSubTopics = mockTopics.map(topic => {
      const subTopics = mockSubTopics.filter(st => st.topicId === topic._id);
      const subTopicsWithQuestions = subTopics.map(subTopic => {
        const questions = mockQuestions.filter(q => q.subTopicId === subTopic._id);
        return {
          ...subTopic,
          questions
        };
      });
      return {
        ...topic,
        subTopics: subTopicsWithQuestions
      };
    });
    
    res.json(topicsWithSubTopics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// GET single topic
router.get('/:id', async (req, res) => {
  try {
    await delay();
    
    const topic = mockTopics.find(t => t._id === req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// POST create new topic
router.post('/', async (req, res) => {
  try {
    await delay();
    
    const { title, description, color } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTopic = {
      _id: 'topic' + Date.now(),
      title: title.trim(),
      description: description?.trim() || '',
      color: color || '#3B82F6',
      order: mockTopics.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockTopics.push(newTopic);
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// PUT update topic
router.put('/:id', async (req, res) => {
  try {
    await delay();
    
    const { title, description, color } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const topicIndex = mockTopics.findIndex(t => t._id === req.params.id);
    if (topicIndex === -1) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    mockTopics[topicIndex] = {
      ...mockTopics[topicIndex],
      title: title.trim(),
      description: description?.trim() || '',
      color: color || '#3B82F6',
      updatedAt: new Date()
    };
    
    res.json(mockTopics[topicIndex]);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// DELETE topic
router.delete('/:id', async (req, res) => {
  try {
    await delay();
    
    const topicIndex = mockTopics.findIndex(t => t._id === req.params.id);
    if (topicIndex === -1) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    mockTopics.splice(topicIndex, 1);
    
    // Remove associated subtopics and questions
    const subTopicIdsToRemove = mockSubTopics
      .filter(st => st.topicId === req.params.id)
      .map(st => st._id);
    
    mockSubTopics.splice(0, mockSubTopics.length, 
      ...mockSubTopics.filter(st => st.topicId !== req.params.id)
    );
    
    mockQuestions.splice(0, mockQuestions.length,
      ...mockQuestions.filter(q => !subTopicIdsToRemove.includes(q.subTopicId))
    );
    
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// PUT reorder topics
router.put('/reorder', async (req, res) => {
  try {
    await delay();
    
    const { topics } = req.body;
    
    if (!Array.isArray(topics)) {
      return res.status(400).json({ error: 'Topics array is required' });
    }
    
    // Update order for each topic
    topics.forEach(({ id, order }) => {
      const topicIndex = mockTopics.findIndex(t => t._id === id);
      if (topicIndex !== -1) {
        mockTopics[topicIndex].order = order;
      }
    });
    
    res.json({ message: 'Topics reordered successfully' });
  } catch (error) {
    console.error('Error reordering topics:', error);
    res.status(500).json({ error: 'Failed to reorder topics' });
  }
});

module.exports = router;
