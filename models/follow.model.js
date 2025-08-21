const mongoose = require('mongoose');

// Follow Schema
const followSchema = new mongoose.Schema({
  // User who is following
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // User being followed
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Intentional vulnerability: No validation to prevent self-following
  // Intentional vulnerability: No validation to prevent duplicate follows
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure uniqueness of follower-following pairs
// But intentionally commented out to allow duplicate follows (vulnerability)
// followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);
