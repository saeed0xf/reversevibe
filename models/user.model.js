const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema with intentional security issues
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  // Intentional vulnerability: role field can be mass assigned during registration
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: 'default.jpg'
  },
  bio: {
    type: String,
    default: ''
  },
  // Intentional vulnerability: phone numbers exposed in API responses
  phone: {
    type: String,
    default: ''
    // Flag location: Some phone numbers contain hidden CTF flags
  },
  // Intentional vulnerability: private field that should not be exposed
  secretNotes: {
    type: String,
    default: ''
    // Flag location: Some admin users have flags in their secretNotes
  },
  // Hidden flag in a seemingly innocent field
  verificationToken: {
    type: String,
    default: 'CTF{n0t_4_r34l_fl4g_just_4_placeholder}'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Intentionally using a low salt round for easier cracking in CTF
    const salt = await bcrypt.genSalt(5);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
