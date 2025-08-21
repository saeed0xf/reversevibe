const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Media = require('../models/media.model');
const Notification = require('../models/notification.model');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @route   GET /admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find();
    
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

// @route   DELETE /admin/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin only)
router.delete('/users/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
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

// @route   GET /admin/posts
// @desc    Get all posts (admin only)
// @access  Private (Admin only)
router.get('/posts', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /admin/posts/:id
// @desc    Delete post (admin only)
// @access  Private (Admin only)
router.delete('/posts/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
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

// @route   GET /admin/media
// @desc    Get all media (admin only)
// @access  Private (Admin only)
router.get('/media', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const media = await Media.find()
      .populate('user', 'username email profilePicture');
    
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

// @route   GET /admin/debug
// @desc    Debug endpoint with sensitive information (admin only, but vulnerable)
// @access  Private (Admin only, but vulnerable)
router.get('/debug', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: Broken function-level access control
    // Only checks if user is authenticated, not if they're an admin
    
    // Check if user is admin to show the flag
    // This makes it a proper challenge - user needs to exploit the role vulnerability first
    const isAdmin = req.user && req.user.role === 'admin';
    
    // Collect system information
    const systemInfo = {
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform,
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      // Flag location: Secret flag in system info, but only shown to admins
      // This requires proper exploitation of the role vulnerability
      secretFlag: isAdmin ? 'CTF{d3bug_3ndp01nt_vuln3r4bl3}' : 'You need admin access to see this flag',
      // Intentional vulnerability: Exposing sensitive configuration
      jwtSecret: require('../config/jwt').secret,
      databaseUri: process.env.MONGO_URI || 'mongodb://localhost:27017/reversevibe',
      adminEmails: ['admin@reversevibe.com', 'superadmin@reversevibe.com']
    };
    
    res.status(200).json({
      success: true,
      data: {
        system: systemInfo,
        request: {
          headers: req.headers,
          ip: req.ip,
          originalUrl: req.originalUrl,
          method: req.method,
          body: req.body
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /admin/logs
// @desc    Get system logs (admin only)
// @access  Private (Admin only)
router.get('/logs', authenticate, authorizeAdmin, async (req, res) => {
  try {
    // Simulate logs with sensitive information
    const logs = [
      {
        timestamp: new Date(),
        level: 'INFO',
        message: 'System started'
      },
      {
        timestamp: new Date(Date.now() - 3600000),
        level: 'ERROR',
        message: 'Database connection failed',
        // Flag location: Secret flag in error logs
        details: 'Connection string contains flag: CTF{l0g_3xp0sur3_vuln}'
      },
      {
        timestamp: new Date(Date.now() - 7200000),
        level: 'WARN',
        message: 'Failed login attempt',
        user: 'admin@reversevibe.com',
        ip: '192.168.1.1'
      }
    ];
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Hidden endpoint not documented in API
// @route   GET /admin/challenges/secret
// @desc    Hidden endpoint with flag
// @access  Private (Admin only, but vulnerable)
router.get('/challenges/secret', authenticate, async (req, res) => {
  try {
    // Still a vulnerability, but requires proper exploitation
    // Only show the flag if the user has found a way to become an admin or moderator
    if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
      // Flag location: Secret flag in hidden endpoint
      res.status(200).json({
        success: true,
        message: 'Congratulations on finding this hidden endpoint and gaining elevated privileges!',
        flag: 'CTF{h1dd3n_3ndp01nt_f0und}'
      });
    } else {
      // Regular users can find the endpoint but won't get the flag
      res.status(200).json({
        success: true,
        message: 'You found the hidden endpoint, but you need higher privileges to see the flag.',
        hint: 'Try to find a way to become an admin or moderator.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
