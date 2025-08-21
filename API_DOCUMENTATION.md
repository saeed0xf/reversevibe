# ReverseVibe API Documentation

This document provides detailed information about all endpoints in the ReverseVibe API, including request parameters, response formats, and authentication requirements.

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Posts](#posts)
4. [Follow](#follow)
5. [Notifications](#notifications)
6. [Media](#media)
7. [Admin](#admin)

## Authentication

### Register a new user
**Endpoint:** `POST /auth/register`  
**Access:** Public  
**Description:** Register a new user account

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "profilePicture": "string (optional)",
  "bio": "string (optional)",
  "phone": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "profilePicture": "string",
      "bio": "string",
      "phone": "string",
      "createdAt": "date"
    },
    "token": "string"
  }
}
```

**Status Codes:**
- 201: User created successfully
- 400: Invalid input
- 500: Server error

### Login user
**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Description:** Authenticate user and return JWT token

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "profilePicture": "string",
      "bio": "string",
      "phone": "string",
      "createdAt": "date"
    },
    "token": "string"
  }
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials
- 500: Server error

## Users

### Get all users
**Endpoint:** `GET /users`  
**Access:** Public  
**Description:** Get a list of all users

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "profilePicture": "string",
      "bio": "string",
      "phone": "string",
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

### Get user by ID
**Endpoint:** `GET /users/:id`  
**Access:** Public  
**Description:** Get a specific user by their ID

**URL Parameters:**
- id: User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string",
    "bio": "string",
    "phone": "string",
    "createdAt": "date"
  }
}
```

**Status Codes:**
- 200: Success
- 404: User not found
- 500: Server error

### Update user
**Endpoint:** `PUT /users/:id`  
**Access:** Private  
**Description:** Update user information

**URL Parameters:**
- id: User ID

**Request Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "profilePicture": "string (optional)",
  "bio": "string (optional)",
  "phone": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string",
    "bio": "string",
    "phone": "string",
    "createdAt": "date"
  }
}
```

**Status Codes:**
- 200: User updated successfully
- 401: Not authenticated
- 404: User not found
- 500: Server error

### Delete user
**Endpoint:** `DELETE /users/:id`  
**Access:** Private  
**Description:** Delete a user account

**URL Parameters:**
- id: User ID

**Request Headers:**
- Authorization: Bearer [token]

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

**Status Codes:**
- 200: User deleted successfully
- 401: Not authenticated
- 404: User not found
- 500: Server error

### Search users
**Endpoint:** `GET /users/search`  
**Access:** Public  
**Description:** Search for users by username or email

**Query Parameters:**
- query: Search term

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "profilePicture": "string",
      "bio": "string",
      "phone": "string",
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

## Posts

### Get all posts
**Endpoint:** `GET /posts`  
**Access:** Public  
**Description:** Get a list of all posts

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "user": {
        "_id": "string",
        "username": "string",
        "email": "string",
        "profilePicture": "string"
      },
      "content": "string",
      "mediaUrl": "string",
      "isHidden": "boolean",
      "likes": ["string"],
      "comments": [
        {
          "user": {
            "_id": "string",
            "username": "string",
            "email": "string",
            "profilePicture": "string"
          },
          "content": "string",
          "createdAt": "date"
        }
      ],
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

### Create a post
**Endpoint:** `POST /posts`  
**Access:** Private  
**Description:** Create a new post

**Request Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "content": "string",
  "mediaUrl": "string (optional)",
  "isHidden": "boolean (optional)",
  "metadata": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "user": "string",
    "content": "string",
    "mediaUrl": "string",
    "isHidden": "boolean",
    "metadata": "object",
    "likes": [],
    "comments": [],
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Status Codes:**
- 201: Post created successfully
- 401: Not authenticated
- 500: Server error

### Get post by ID
**Endpoint:** `GET /posts/:id`  
**Access:** Public  
**Description:** Get a specific post by ID

**URL Parameters:**
- id: Post ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "profilePicture": "string"
    },
    "content": "string",
    "mediaUrl": "string",
    "isHidden": "boolean",
    "likes": ["string"],
    "comments": [
      {
        "user": {
          "_id": "string",
          "username": "string",
          "email": "string",
          "profilePicture": "string"
        },
        "content": "string",
        "createdAt": "date"
      }
    ],
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Status Codes:**
- 200: Success
- 404: Post not found
- 500: Server error

### Update post
**Endpoint:** `PUT /posts/:id`  
**Access:** Private  
**Description:** Update a post

**URL Parameters:**
- id: Post ID

**Request Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "content": "string (optional)",
  "mediaUrl": "string (optional)",
  "isHidden": "boolean (optional)",
  "metadata": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "user": "string",
    "content": "string",
    "mediaUrl": "string",
    "isHidden": "boolean",
    "metadata": "object",
    "likes": ["string"],
    "comments": [
      {
        "user": "string",
        "content": "string",
        "createdAt": "date"
      }
    ],
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Status Codes:**
- 200: Post updated successfully
- 401: Not authenticated
- 404: Post not found
- 500: Server error

### Delete post
**Endpoint:** `DELETE /posts/:id`  
**Access:** Private  
**Description:** Delete a post

**URL Parameters:**
- id: Post ID

**Request Headers:**
- Authorization: Bearer [token]

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

**Status Codes:**
- 200: Post deleted successfully
- 401: Not authenticated
- 404: Post not found
- 500: Server error

### Add comment to post
**Endpoint:** `POST /posts/:id/comment`  
**Access:** Private  
**Description:** Add a comment to a post

**URL Parameters:**
- id: Post ID

**Request Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "user": "string",
    "content": "string",
    "mediaUrl": "string",
    "isHidden": "boolean",
    "likes": ["string"],
    "comments": [
      {
        "user": "string",
        "content": "string",
        "createdAt": "date"
      }
    ],
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Status Codes:**
- 201: Comment added successfully
- 401: Not authenticated
- 404: Post not found
- 500: Server error

### Search posts
**Endpoint:** `GET /posts/search`  
**Access:** Public  
**Description:** Search for posts by content

**Query Parameters:**
- query: Search term

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "user": {
        "_id": "string",
        "username": "string",
        "email": "string",
        "profilePicture": "string"
      },
      "content": "string",
      "mediaUrl": "string",
      "isHidden": "boolean",
      "likes": ["string"],
      "comments": [
        {
          "user": {
            "_id": "string",
            "username": "string",
            "email": "string",
            "profilePicture": "string"
          },
          "content": "string",
          "createdAt": "date"
        }
      ],
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 500: Server error

## Follow

### Follow a user
**Endpoint:** `POST /follow`  
**Access:** Private  
**Description:** Follow another user

**Request Headers:**
- Authorization: Bearer [token]

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "follower": "string",
    "following": "string",
    "createdAt": "date"
  }
}
```

**Status Codes:**
- 201: Follow relationship created successfully
- 401: Not authenticated
- 404: User to follow not found
- 500: Server error

### Unfollow a user
**Endpoint:** `DELETE /follow/:id`  
**Access:** Private  
**Description:** Unfollow a user by deleting the follow relationship

**URL Parameters:**
- id: Follow relationship ID

**Request Headers:**
- Authorization: Bearer [token]

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

**Status Codes:**
- 200: Follow relationship deleted successfully
- 401: Not authenticated
- 404: Follow relationship not found
- 500: Server error

### Get authenticated user's followers
**Endpoint:** `GET /followers`  
**Access:** Private  
**Description:** Get users who follow the authenticated user

**Request Headers:**
- Authorization: Bearer [token]

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "follower": {
        "_id": "string",
        "username": "string",
        "email": "string",
        "phone": "string",
        "profilePicture": "string",
        "bio": "string"
      },
      "following": "string",
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 500: Server error

### Get users that authenticated user follows
**Endpoint:** `GET /following`  
**Access:** Private  
**Description:** Get users that the authenticated user follows

**Request Headers:**
- Authorization: Bearer [token]

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "follower": "string",
      "following": {
        "_id": "string",
        "username": "string",
        "email": "string",
        "phone": "string",
        "profilePicture": "string",
        "bio": "string"
      },
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Not authenticated
- 500: Server error

### Get followers of a specific user
**Endpoint:** `GET /followers/:userId`  
**Access:** Public  
**Description:** Get followers of a specific user

**URL Parameters:**
- userId: User ID

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "follower": {
        "_id": "string",
        "username": "string",
        "email": "string",
        "phone": "string",
        "profilePicture": "string",
        "bio": "string"
      },
      "following": "string",
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 404: User not found
- 500: Server error

### Get users that a specific user follows
**Endpoint:** `GET /following/:userId`  
**Access:** Public  
**Description:** Get users that a specific user follows

**URL Parameters:**
- userId: User ID

**Response:**
```json
{
  "success": true,
  "count": "number",
  "data": [
    {
      "_id": "string",
      "follower": "string",
      "following": {
        "_id": "string",
        "username": "string",
        "email": "string",
        "phone": "string",
        "profilePicture": "string",
        "bio": "string"
      },
      "createdAt": "date"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 404: User not found
- 500: Server error