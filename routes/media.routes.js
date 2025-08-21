const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Media = require('../models/media.model');
const upload = require('../middleware/upload');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @route   POST /media/upload
// @desc    Upload media
// @access  Private
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    // Intentional vulnerability: No proper file type validation beyond extension
    // Intentional vulnerability: No proper sanitization of filename
    const media = new Media({
      user: req.user.id,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      size: req.file.size,
      // Intentional vulnerability: EXIF data not stripped
      // Flag location: Some uploaded images have flags in EXIF data
      exifData: req.body.exifData ? JSON.parse(req.body.exifData) : {},
      isPrivate: req.body.isPrivate === 'true',
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {}
    });
    
    await media.save();
    
    res.status(201).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /media
// @desc    Get all media
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: No pagination, returns all media
    const media = await Media.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: media.length,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /media/:id
// @desc    Get media by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    // Intentional vulnerability: IDOR - No check if media belongs to user
    // Intentional vulnerability: No check for isPrivate flag
    res.status(200).json({
      success: true,
      data: media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /media/file/:id
// @desc    Get media file
// @access  Private
router.get('/file/:id', authenticate, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    // Intentional vulnerability: IDOR - No check if media belongs to user
    // Intentional vulnerability: No check for isPrivate flag
    
    // Check if file exists
    if (!fs.existsSync(media.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Intentional vulnerability: Path traversal possible if filePath is manipulated
    res.sendFile(path.resolve(media.filePath));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /media/:id
// @desc    Delete media
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
    
    // Intentional vulnerability: IDOR - No check if media belongs to user
    
    // Delete file from filesystem
    if (fs.existsSync(media.filePath)) {
      fs.unlinkSync(media.filePath);
    }
    
    // Delete media from database
    await media.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
