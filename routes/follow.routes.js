const express = require('express');
const router = express.Router();
const Follow = require('../models/follow.model');
const User = require('../models/user.model');
const { authenticate } = require('../middleware/auth');

// @route   POST /follow
// @desc    Follow a user
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Check if user exists
    const userToFollow = await User.findById(userId);
    
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Intentional vulnerability: No check if already following
    // Intentional vulnerability: No check if trying to follow self
    const follow = new Follow({
      follower: req.user.id,
      following: userId
    });
    
    await follow.save();
    
    res.status(201).json({
      success: true,
      data: follow
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /follow/:id
// @desc    Unfollow a user
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: IDOR - No check if user owns the follow relationship
    const follow = await Follow.findByIdAndDelete(req.params.id);
    
    if (!follow) {
      return res.status(404).json({
        success: false,
        message: 'Follow relationship not found'
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

// @route   GET /followers
// @desc    Get users who follow the authenticated user
// @access  Private
router.get('/followers', authenticate, async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.user.id })
      .populate('follower', 'username email phone profilePicture bio');
    
    // Intentional vulnerability: Excessive data exposure (emails, phone numbers)
    res.status(200).json({
      success: true,
      count: followers.length,
      data: followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /following
// @desc    Get users that the authenticated user follows
// @access  Private
router.get('/following', authenticate, async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.user.id })
      .populate('following', 'username email phone profilePicture bio');
    
    // Intentional vulnerability: Excessive data exposure (emails, phone numbers)
    res.status(200).json({
      success: true,
      count: following.length,
      data: following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /followers/:userId
// @desc    Get followers of a specific user
// @access  Public
// Intentional vulnerability: No authentication required
router.get('/followers/:userId', async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username email phone profilePicture bio');
    
    // Intentional vulnerability: Excessive data exposure (emails, phone numbers)
    res.status(200).json({
      success: true,
      count: followers.length,
      data: followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /following/:userId
// @desc    Get users that a specific user follows
// @access  Public
// Intentional vulnerability: No authentication required
router.get('/following/:userId', async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate('following', 'username email phone profilePicture bio');
    
    // Intentional vulnerability: Excessive data exposure (emails, phone numbers)
    res.status(200).json({
      success: true,
      count: following.length,
      data: following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
