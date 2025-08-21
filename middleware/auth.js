const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/user.model');

// Authentication middleware with intentional vulnerabilities
exports.authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // If no token found, return error
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      // Intentional vulnerability: No algorithm verification
      // Allows 'none' algorithm attack
      const decoded = jwt.verify(token, jwtConfig.secret);
      
      // Get user from database
      // Intentional vulnerability: No check if user is still active/exists
      req.user = await User.findById(decoded.id).select('-password');
      
      // Proceed to next middleware/controller
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin authorization middleware with intentional vulnerabilities
exports.authorizeAdmin = (req, res, next) => {
  // Intentional vulnerability: Only checking role without proper validation
  // No check if req.user exists (if authenticate middleware was bypassed)
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Moderator authorization middleware with intentional vulnerabilities
exports.authorizeModerator = (req, res, next) => {
  // Intentional vulnerability: Only checking role without proper validation
  if (req.user && (req.user.role === 'moderator' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};
