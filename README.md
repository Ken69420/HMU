# HypeNexus

HypeNexus is a messaging platform built with Node.js, Express, Sequelize, and Socket.io. It provides real-time messaging capabilities with user authentication and role-based access control.

## Features

- User registration and email verification
- User authentication with JWT
- Role-based access control (Super Admin, Admin, Normal User)
- Real-time messaging with Socket.io
- Rate limiting for login and registration
- Email notifications using Nodemailer

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd HypeNexus
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   DB_HOST
   DB_USER
   DB_PASS
   DB_NAME
   JWT_SECRET
   REFRESH_SECRET
   MAILTRAP_USER
   MAILTRAP_PASS
   ```

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `GET /api/auth/verify-email/:token` - Verify user email
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Messaging

- `POST /api/messages` - Send a message (Authenticated users)
- `GET /api/messages` - Receive messages (Authenticated users)

### Admin

- `GET /api/admin` - Admin dashboard (Admin and Super Admin)
- `POST /api/users` - Create a new user (Super Admin)
- `GET /api/users` - Get all users (Super Admin)
- `PUT /api/users/:userId` - Update user details (Super Admin)
- `DELETE /api/users/:userId` - Delete a user (Super Admin)

## Middleware

- `authMiddleware.js` - Authentication middleware
- `roleMiddleware.js` - Role-based access control middleware
- `rateLimitMiddleware.js` - Rate limiting middleware

## Models

- `userModel.js` - User model
- `messageModel.js` - Message model

## Utils

- `email.js` - Utility for sending verification emails
