const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @route   GET /posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Intentional vulnerability: No pagination, returns all posts
    // But we'll only return non-hidden posts to make the CTF more challenging
    // The IDOR vulnerability will be exploited through the individual post endpoint
    const posts = await Post.find({ isHidden: false })
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

// @route   POST /posts
// @desc    Create a post
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: No sanitization for XSS
    const post = new Post({
      user: req.user.id,
      content: req.body.content,
      mediaUrl: req.body.mediaUrl,
      isHidden: req.body.isHidden,
      metadata: req.body.metadata
    });
    
    await post.save();
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username email profilePicture')
      .populate('comments.user', 'username email profilePicture');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Intentional vulnerability: IDOR for hidden posts
    // But we'll make it a bit more challenging - if the post is hidden, 
    // only return it if the user is authenticated and is either the post owner or an admin
    // This way, the CTF participant needs to exploit the IDOR vulnerability properly
    if (post.isHidden) {
      // Check if user is authenticated
      const isAuthenticated = req.headers.authorization && 
                              req.headers.authorization.startsWith('Bearer');
      
      // If not authenticated, don't show hidden post
      if (!isAuthenticated) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // If authenticated, we'll still return the post (IDOR vulnerability)
      // But the CTF participant needs to be authenticated first
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Intentional vulnerability: IDOR - No check if user owns the post
    // Any authenticated user can update any post
    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Intentional vulnerability: IDOR - No check if user owns the post
    // Any authenticated user can delete any post
    await post.remove();
    
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

// @route   POST /posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Intentional vulnerability: No sanitization for XSS
    const comment = {
      user: req.user.id,
      content: req.body.content
    };
    
    post.comments.unshift(comment);
    
    await post.save();
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /posts/search
// @desc    Search posts
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    // Intentional vulnerability: NoSQL injection possible
    const posts = await Post.find({
      content: { $regex: query, $options: 'i' }
    })
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

module.exports = router;
