const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/user.model');

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
// Intentional vulnerability: Mass assignment - allows setting role
router.post('/register', async (req, res) => {
  try {
    // Intentional vulnerability: No validation or sanitization of input
    // Intentional vulnerability: Mass assignment allows setting role to admin
    const user = new User(req.body);
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    // Return user data and token
    // Intentional vulnerability: Returns too much information
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create JWT token
    // Intentional vulnerability: Weak JWT secret
    const token = jwt.sign(
      { id: user._id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    
    // Return user data and token
    // Intentional vulnerability: Returns too much information
    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
