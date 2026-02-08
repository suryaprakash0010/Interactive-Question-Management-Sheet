const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const SubTopic = require('../models/SubTopic');

// Simulate network latency for realistic UX
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GET all topics with their subtopics and questions
router.get('/', async (req, res) => {
  try {
    await delay();
    
    const topics = await Topic.find({}).sort({ order: 1 }).lean();
    
    // Get subtopics for each topic
    const topicsWithSubTopics = await Promise.all(
      topics.map(async (topic) => {
        const subTopics = await SubTopic.find({ topicId: topic._id })
          .sort({ order: 1 })
          .lean();
        
        return {
          ...topic,
          subTopics
        };
      })
    );
    
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
    
    const topic = await Topic.findById(req.params.id);
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
    
    // Get the highest order value to append at the end
    const lastTopic = await Topic.findOne({}).sort({ order: -1 });
    const order = lastTopic ? lastTopic.order + 1 : 0;
    
    const topic = new Topic({
      title: title.trim(),
      description: description?.trim() || '',
      color: color || '#3B82F6',
      order
    });
    
    await topic.save();
    res.status(201).json(topic);
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
    
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description?.trim() || '',
        color: color || '#3B82F6'
      },
      { new: true, runValidators: true }
    );
    
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// DELETE topic
router.delete('/:id', async (req, res) => {
  try {
    await delay();
    
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    // Delete associated subtopics and questions
    await SubTopic.deleteMany({ topicId: req.params.id });
    
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
    const updatePromises = topics.map(({ id, order }) =>
      Topic.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Topics reordered successfully' });
  } catch (error) {
    console.error('Error reordering topics:', error);
    res.status(500).json({ error: 'Failed to reorder topics' });
  }
});

module.exports = router;
