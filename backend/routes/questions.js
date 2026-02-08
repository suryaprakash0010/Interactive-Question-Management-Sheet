const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Simulate network latency for realistic UX
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// GET all questions
router.get('/', async (req, res) => {
  try {
    await delay();
    
    const { subTopicId, difficulty, status, search } = req.query;
    const filter = {};
    
    if (subTopicId) filter.subTopicId = subTopicId;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const questions = await Question.find(filter)
      .sort({ order: 1 })
      .populate('subTopicId', 'title')
      .lean();
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// GET single question
router.get('/:id', async (req, res) => {
  try {
    await delay();
    
    const question = await Question.findById(req.params.id)
      .populate('subTopicId', 'title')
      .lean();
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
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
    
    // Get the highest order value for this subtopic to append at the end
    const lastQuestion = await Question.findOne({ subTopicId }).sort({ order: -1 });
    const order = lastQuestion ? lastQuestion.order + 1 : 0;
    
    const question = new Question({
      title: title.trim(),
      description: description?.trim() || '',
      subTopicId,
      difficulty: difficulty || 'Medium',
      status: status || 'Todo',
      tags: tags || []
    });
    
    await question.save();
    const savedQuestion = await Question.findById(question._id)
      .populate('subTopicId', 'title')
      .lean();
    
    res.status(201).json(savedQuestion);
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
    
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description?.trim() || '',
        difficulty: difficulty || 'Medium',
        status: status || 'Todo',
        tags: tags || []
      },
      { new: true, runValidators: true }
    ).populate('subTopicId', 'title');
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// DELETE question
router.delete('/:id', async (req, res) => {
  try {
    await delay();
    
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
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
    const updatePromises = questions.map(({ id, order }) =>
      Question.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
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
    
    const questions = await Question.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .sort({ updatedAt: -1 })
    .populate('subTopicId', 'title')
    .lean();
    
    res.json(questions);
  } catch (error) {
    console.error('Error searching questions:', error);
    res.status(500).json({ error: 'Failed to search questions' });
  }
});

module.exports = router;
