const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seedDatabase');

// Load environment variables
require('dotenv').config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/posts', require('./routes/post.routes'));
app.use('/follow', require('./routes/follow.routes'));
app.use('/notifications', require('./routes/notification.routes'));
app.use('/media', require('./routes/media.routes'));
app.use('/admin', require('./routes/admin.routes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ReverseVibe API',
    version: '1.0.0'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// Define port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Seed database if in development mode
  if (process.env.NODE_ENV === 'development' || process.env.SEED_DB === 'true') {
    await seedDatabase();
  }
});
