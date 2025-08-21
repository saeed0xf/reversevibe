const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// @route   GET /notifications
// @desc    Get all notifications for authenticated user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: No pagination, returns all notifications
    // But we'll make it a proper challenge - only return admin notifications if user is admin or moderator
    // This requires proper exploitation of the role vulnerability
    let query = { recipient: req.user.id };
    
    // If user is not admin or moderator, filter out admin-only notifications
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      query.isAdminOnly = { $ne: true };
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', 'username email profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /notifications/:id
// @desc    Get notification by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('sender', 'username email profilePicture');
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Intentional vulnerability: IDOR - No check if notification belongs to user
    // But we'll make it a proper challenge - only return admin-only notifications 
    // if user is admin or moderator
    if (notification.isAdminOnly && req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this notification'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /notifications/:id
// @desc    Mark notification as read
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: IDOR - No check if notification belongs to user
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: IDOR - No check if notification belongs to user
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
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

// @route   POST /notifications
// @desc    Create a notification (for system use)
// @access  Private (Admin only, but vulnerable)
router.post('/', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: No proper role check
    // Any authenticated user can create notifications
    const notification = new Notification({
      recipient: req.body.recipient,
      sender: req.user.id,
      type: req.body.type,
      message: req.body.message,
      reference: req.body.reference,
      referenceModel: req.body.referenceModel,
      isAdminOnly: req.body.isAdminOnly,
      metadata: req.body.metadata
    });
    
    await notification.save();
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /notifications/admin
// @desc    Get all admin notifications
// @access  Private (Admin only, but vulnerable)
router.get('/admin', authenticate, async (req, res) => {
  try {
    // Intentional vulnerability: Broken function-level access control
    // But we'll make it a proper challenge - check if the user has a role property
    // This requires proper exploitation of the mass assignment vulnerability
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // If the user has exploited the mass assignment vulnerability to set their role,
    // they can access this endpoint
    const notifications = await Notification.find({ isAdminOnly: true })
      .populate('sender', 'username email profilePicture')
      .populate('recipient', 'username email profilePicture')
      .sort({ createdAt: -1 });
    
    // Flag location: Some admin notifications contain flags
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
