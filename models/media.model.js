const mongoose = require('mongoose');

// Media Schema with intentional security issues
const mediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  // Intentional vulnerability: Insufficient validation of file types
  fileType: {
    type: String,
    required: true
    // Vulnerability: Only basic validation, can be bypassed
  },
  filePath: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  // Intentional vulnerability: EXIF data not stripped
  // Flag location: Some uploaded images have flags in EXIF data
  exifData: {
    type: Object,
    default: {}
  },
  // Intentional vulnerability: No proper access control
  isPrivate: {
    type: Boolean,
    default: false
  },
  // Intentional vulnerability: Metadata can contain sensitive information
  metadata: {
    type: Object,
    default: {}
    // Flag location: Some media files have flags in their metadata
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);
