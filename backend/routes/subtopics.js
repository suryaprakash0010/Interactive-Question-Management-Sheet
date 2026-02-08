const express = require('express');
const router = express.Router();
const SubTopic = require('../models/SubTopic');
const Question = require('../models/Question');

// Simulate network latency for realistic UX
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GET all subtopics with their questions
router.get('/', async (req, res) => {
  try {
    await delay();
    
    const { topicId } = req.query;
    const filter = topicId ? { topicId } : {};
    
    const subTopics = await SubTopic.find(filter).sort({ order: 1 }).lean();
    
    // Get questions for each subtopic
    const subTopicsWithQuestions = await Promise.all(
      subTopics.map(async (subTopic) => {
        const questions = await Question.find({ subTopicId: subTopic._id })
          .sort({ order: 1 })
          .lean();
        
        return {
          ...subTopic,
          questions
        };
      })
    );
    
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
    
    const subTopic = await SubTopic.findById(req.params.id);
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
    
    // Get the highest order value for this topic to append at the end
    const lastSubTopic = await SubTopic.findOne({ topicId }).sort({ order: -1 });
    const order = lastSubTopic ? lastSubTopic.order + 1 : 0;
    
    const subTopic = new SubTopic({
      title: title.trim(),
      description: description?.trim() || '',
      topicId,
      order
    });
    
    await subTopic.save();
    res.status(201).json(subTopic);
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
    
    const subTopic = await SubTopic.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description?.trim() || ''
      },
      { new: true, runValidators: true }
    );
    
    if (!subTopic) {
      return res.status(404).json({ error: 'SubTopic not found' });
    }
    
    res.json(subTopic);
  } catch (error) {
    console.error('Error updating subtopic:', error);
    res.status(500).json({ error: 'Failed to update subtopic' });
  }
});

// DELETE subtopic
router.delete('/:id', async (req, res) => {
  try {
    await delay();
    
    const subTopic = await SubTopic.findByIdAndDelete(req.params.id);
    if (!subTopic) {
      return res.status(404).json({ error: 'SubTopic not found' });
    }
    
    // Delete associated questions
    await Question.deleteMany({ subTopicId: req.params.id });
    
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
    const updatePromises = subTopics.map(({ id, order }) =>
      SubTopic.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'SubTopics reordered successfully' });
  } catch (error) {
    console.error('Error reordering subtopics:', error);
    res.status(500).json({ error: 'Failed to reorder subtopics' });
  }
});

module.exports = router;
