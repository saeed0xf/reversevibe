const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Follow = require('../models/follow.model');
const Notification = require('../models/notification.model');
const Media = require('../models/media.model');
const bcrypt = require('bcryptjs');

// Seed database with initial data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Follow.deleteMany();
    await Notification.deleteMany();
    await Media.deleteMany();
    
    console.log('Database cleared');
    
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 5);
    const userPassword = await bcrypt.hash('user123', 5);
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@reversevibe.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1-555-CTF-FLAG',
      secretNotes: 'CTF\{dummy_flag\}',
      verificationToken: 'CTF\{dummy_flag\}'
    });
    
    const user1 = await User.create({
      username: 'user1',
      email: 'user1@reversevibe.com',
      password: userPassword,
      role: 'user',
      phone: '+1-555-123-4567',
      bio: 'Regular user'
    });
    
    const user2 = await User.create({
      username: 'user2',
      email: 'user2@reversevibe.com',
      password: userPassword,
      role: 'user',
      phone: '+1-555-765-4321',
      bio: 'Another regular user'
    });
    
    const moderator = await User.create({
      username: 'moderator',
      email: 'mod@reversevibe.com',
      password: userPassword,
      role: 'moderator',
      phone: '+1-555-MOD-FLAG',
      secretNotes: 'CTF\{dummy_flag\}'
    });
    
    console.log('Users created');
    
    // Create posts
    const post1 = await Post.create({
      user: user1._id,
      content: 'Hello ReverseVibe! This is my first post.',
      isHidden: false
    });
    
    const post2 = await Post.create({
      user: user2._id,
      content: 'I love this platform!',
      isHidden: false
    });
    
    const post3 = await Post.create({
      user: admin._id,
      content: 'Welcome to ReverseVibe. This is an admin post.',
      isHidden: false
    });
    
    const hiddenPost = await Post.create({
      user: admin._id,
      content: 'This is a hidden post with a flag: CTF\{dummy_flag\}',
      isHidden: true,
      metadata: {
        secretKey: 'CTF\{dummy_flag\}'
      }
    });
    
    console.log('Posts created');
    
    // Create follows
    await Follow.create({
      follower: user1._id,
      following: admin._id
    });
    
    await Follow.create({
      follower: user2._id,
      following: admin._id
    });
    
    await Follow.create({
      follower: user2._id,
      following: user1._id
    });
    
    console.log('Follows created');
    
    // Create notifications
    await Notification.create({
      recipient: user1._id,
      sender: admin._id,
      type: 'system',
      message: 'Welcome to ReverseVibe!',
      read: false
    });
    
    await Notification.create({
      recipient: user2._id,
      sender: admin._id,
      type: 'system',
      message: 'Welcome to ReverseVibe!',
      read: false
    });
    
    await Notification.create({
      recipient: admin._id,
      sender: admin._id,
      type: 'admin',
      message: 'System check required. Flag: CTF\{dummy_flag\}',
      isAdminOnly: true,
      read: false,
      metadata: {
        priority: 'high',
        secretData: 'CTF\{dummy_flag\}'
      }
    });
    
    console.log('Notifications created');
    
    // Create fake media entries (without actual files)
    await Media.create({
      user: user1._id,
      filename: 'profile.jpg',
      fileType: 'image/jpeg',
      filePath: './uploads/profile.jpg',
      size: 1024,
      exifData: {
        make: 'Canon',
        model: 'EOS R5',
        secretFlag: 'CTF\{dummy_flag\}'
      },
      isPrivate: false
    });
    
    await Media.create({
      user: admin._id,
      filename: 'admin_document.pdf',
      fileType: 'application/pdf',
      filePath: './uploads/admin_document.pdf',
      size: 2048,
      isPrivate: true,
      metadata: {
        description: 'Admin only document',
        secretKey: 'CTF\{dummy_flag\}'
      }
    });
    
    console.log('Media entries created');
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;
