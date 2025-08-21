const mongoose = require('mongoose');

// Notification Schema with intentional security issues
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'system', 'admin', 'security'],
    required: true
  },
  // Reference to related content
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['Post', 'User', 'Comment']
  },
  // Intentional vulnerability: message can contain sensitive information
  message: {
    type: String,
    required: true
    // Flag location: Some admin notifications contain flags in their messages
  },
  // Intentional vulnerability: No proper access control for admin notifications
  isAdminOnly: {
    type: Boolean,
    default: false
  },
  // Intentional vulnerability: Sensitive data in metadata
  metadata: {
    type: Object,
    default: {}
    // Flag location: Some notifications have flags in their metadata
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
