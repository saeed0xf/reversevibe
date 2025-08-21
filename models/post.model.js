const mongoose = require('mongoose');

// Post Schema with intentional security issues
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
    // Intentional vulnerability: No sanitization for XSS
    // Flag location: Some hidden posts contain flags in their content
  },
  // Intentional vulnerability: No validation on URLs
  mediaUrl: {
    type: String,
    default: ''
  },
  // Hidden posts should not be visible to regular users
  // Intentional vulnerability: No proper access control checks
  isHidden: {
    type: Boolean,
    default: false
  },
  // Intentional vulnerability: metadata can contain sensitive information
  metadata: {
    type: Object,
    default: {}
    // Flag location: Some posts have flags in their metadata
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String
      // Intentional vulnerability: No sanitization for XSS
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', postSchema);
