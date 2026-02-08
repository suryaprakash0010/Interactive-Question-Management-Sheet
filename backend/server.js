const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (commented out for mock data)
// mongoose.connect(process.env.MONGODB_URI)
// .then(() => console.log('MongoDB connected successfully'))
// .catch((err) => console.error('MongoDB connection error:', err));

console.log('Using mock data (MongoDB not required)');

// Routes (using mock data)
app.use('/api/topics', require('./routes/mock-topics'));
app.use('/api/subtopics', require('./routes/mock-subtopics'));
app.use('/api/questions', require('./routes/mock-questions'));
app.use('/api/external', require('./routes/external-api'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Root route and favicon for development
app.get('/', (req, res) => {
  res.json({ 
    message: 'Question Management Sheet API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      topics: '/api/topics',
      subtopics: '/api/subtopics',
      questions: '/api/questions'
    }
  });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    console.error('Close the other server using this port, or run with a different port:');
    console.error('Windows: set PORT=5001 && npm start');
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
