# ReverseVibe CTF Challenge

**NOTE ⚠️ : THE PROJECT IS NOT COMPLETE YET.**

ReverseVibe is a social media API with intentional security vulnerabilities for CTF challenges.

## Project Overview

This project is a Node.js/Express.js API with MongoDB (Mongoose) that simulates a social media platform. It contains various security vulnerabilities for CTF participants to discover and exploit. 


1. Install dependencies:
   ```
   npm install
   ```

2. Make sure MongoDB is running locally or update the `.env` file with your MongoDB connection string.

3. Start the server:
   ```
   node server.js
   ```

4. The server will run on port 3000 by default (http://localhost:3000).

## API Endpoints
Full comprehensive [API Documentation](./API_DOCUMENTATION.md)

### Authentication
- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login and get JWT token

### Users
- GET `/users` - Get all users
- GET `/users/:id` - Get user by ID
- PUT `/users/:id` - Update user
- DELETE `/users/:id` - Delete user
- GET `/users/search` - Search users

### Posts
- GET `/posts` - Get all posts
- POST `/posts` - Create a post
- GET `/posts/:id` - Get post by ID
- PUT `/posts/:id` - Update post
- DELETE `/posts/:id` - Delete post
- POST `/posts/:id/comment` - Add comment to post
- GET `/posts/search` - Search posts

### Follow
- POST `/follow` - Follow a user
- DELETE `/follow/:id` - Unfollow a user
- GET `/followers` - Get authenticated user's followers
- GET `/following` - Get users that authenticated user follows
- GET `/followers/:userId` - Get followers of a specific user
- GET `/following/:userId` - Get users that a specific user follows

### Notifications
- GET `/notifications` - Get all notifications for authenticated user
- GET `/notifications/:id` - Get notification by ID
- PUT `/notifications/:id` - Mark notification as read
- DELETE `/notifications/:id` - Delete notification
- POST `/notifications` - Create a notification
- GET `/notifications/admin` - Get all admin notifications

### Media
- POST `/media/upload` - Upload media
- GET `/media` - Get all media for authenticated user
- GET `/media/:id` - Get media by ID
- GET `/media/file/:id` - Get media file
- DELETE `/media/:id` - Delete media

### Admin
- GET `/admin/users` - Get all users (admin only)
- DELETE `/admin/users/:id` - Delete user (admin only)
- GET `/admin/posts` - Get all posts (admin only)
- DELETE `/admin/posts/:id` - Delete post (admin only)
- GET `/admin/media` - Get all media (admin only)
- GET `/admin/debug` - Debug endpoint with sensitive information (admin only)
- GET `/admin/logs` - Get system logs (admin only)

## CTF Challenges

This API contains multiple intentional security vulnerabilities for CTF challenges, including:

1. Mass assignment vulnerabilities
2. Weak JWT implementation
3. XSS vulnerabilities
4. IDOR/BOLA vulnerabilities
5. Broken function-level access control
6. Excessive data exposure
7. File upload vulnerabilities
8. Hidden endpoints with flags

Flags are hidden throughout the application in various locations.

## Note

This project is designed for educational purposes and CTF challenges. Do not use in production environments.
