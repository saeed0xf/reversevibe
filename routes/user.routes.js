const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @route   GET /users
// @desc    Get all users
// @access  Public
// Intentional vulnerability: No authentication required
router.get('/', async (req, res) => {
  try {
    // Intentional vulnerability: No pagination, returns all users
    // But we don't want to expose flags directly - that's too easy
    const users = await User.find().select('username email role profilePicture bio createdAt');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /users/:id
// @desc    Get user by ID
// @access  Public
// Intentional vulnerability: No authentication required
router.get('/:id', async (req, res) => {
  try {
    // Still a vulnerability, but don't expose flags directly
    const user = await User.findById(req.params.id).select('username email role profilePicture bio createdAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Intentional vulnerability: Returns some user information without authentication
    // But not exposing flags directly
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /users/:id
// @desc    Update user
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: IDOR - No check if user is updating their own profile
    // Intentional vulnerability: Mass assignment - allows updating role
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: IDOR - No check if user is deleting their own profile
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
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

// @route   GET /users/search
// @desc    Search users
// @access  Public
// Intentional vulnerability: No authentication required
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    // Intentional vulnerability: NoSQL injection possible
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
