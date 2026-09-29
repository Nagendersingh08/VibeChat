# VibeChat

A full-stack real-time chat application built with the MERN stack and Socket.IO, featuring secure authentication, one-to-one messaging, real-time online presence, image sharing, profile management, and responsive UI.

Live Demo : https://vibechat-frontend-topaz.vercel.app

---

## Demo Account

You can explore the application using the following demo credentials:

| Field    | Demo                |
| -------- | ------------------- |
| Email    | `demo11@gmail.com`  |
| Password | `123456`            |

> The demo account is provided for testing and demonstration purposes.

---

## Overview

VibeChat is designed as a real-time communication platform where authenticated users can search for other users, start conversations, exchange text and image messages, see online status, track unread messages, and manage their conversations.

The application uses a React frontend, an Express/Node.js backend, MongoDB for persistent data, Socket.IO for real-time communication, and Cloudinary for image storage.

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Protected backend routes
* Persistent authenticated session

### Messaging

* One-to-one conversations
* Real-time message delivery
* Text messages
* Image messages
* Message timestamps
* Seen/unseen message status
* Unread message counts

### Real-Time Communication

* Online/offline user presence
* Instant message updates
* Socket connection management
* Support for multiple active connections per user

### User Management

* User search
* Profile management
* Profile picture upload
* Bio management
* Password update

### Conversation Management

* Delete conversations
* Hide contacts
* Restore hidden contacts
* View shared media
* Conversation-specific actions

### User Experience

* Responsive three-panel chat interface
* Mobile-friendly layout
* Image preview before sending
* Toast notifications
* Confirmation dialogs
* Clean and modern UI

---

## Tech Stack

| Layer          | Technologies                            |
| -------------- | --------------------------------------- |
| Frontend       | React, Vite, React Router, Tailwind CSS |
| Communication  | Axios, Socket.IO Client                 |
| Backend        | Node.js, Express.js                     |
| Database       | MongoDB, Mongoose                       |
| Authentication | JWT, bcryptjs                           |
| Real-Time      | Socket.IO                               |
| Image Storage  | Cloudinary                              |
| Notifications  | React Hot Toast                         |
| Development    | VS Code, Git, GitHub                    |

---

## Application Architecture

```text
                           VibeChat
                              │
                ┌─────────────┴─────────────┐
                │                           │
          React Frontend              Node.js Backend
                │                           │
        ┌───────┴────────┐          ┌───────┴────────┐
        │                │          │                │
     REST API        Socket.IO   Express API     Socket.IO
        │                │          │                │
        └────────┬───────┘          └───────┬────────┘
                 │                          │
                 └──────────────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                 MongoDB                Cloudinary
              Users / Messages             Images
```

The application uses two communication mechanisms:

* REST APIs handle authentication, profiles, users, conversations, and database operations.
* Socket.IO handles real-time messaging and online presence.

---

## Main UI Structure

The authenticated home page uses a three-panel layout:

```text
┌──────────────────────────────────────────────────────────────┐
│                         VibeChat                             │
├───────────────────┬────────────────────────┬─────────────────┤
│     Sidebar       │     Chat Container     │   Right Sidebar │
│                   │                        │                 │
│  Search           │  Messages              │  Profile        │
│  Users            │  Input                 │  Status         │
│  Online Status    │  Image Upload          │  Media          │
│  Unread Count     │  Send                  │  Actions        │
│                   │                        │  Logout         │
└───────────────────┴────────────────────────┴─────────────────┘
```

### Sidebar

The sidebar manages user discovery and conversation selection.

It provides:

* Search
* User list
* Online indicators
* Unread message counts
* Conversation selection

### Chat Container

The central area contains the active conversation.

It handles:

* Message history
* Text input
* Image selection
* Image preview
* Message sending
* Seen status
* Real-time message updates

### Right Sidebar

The right panel provides information and actions related to the selected user.

It contains:

* Profile information
* Online status
* Shared media
* Conversation actions
* Logout

### Responsive Design

On smaller screens, the three-panel layout adapts so users can move between the sidebar and the conversation view while maintaining the core chat functionality.

---

## Authentication Flow

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Login / Register │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Express Backend  │
└────────┬─────────┘
         │
         ├── Register → Hash Password → MongoDB
         │
         └── Login → Verify Password
                          │
                          ▼
                    Generate JWT
                          │
                          ▼
                  Authenticated Client
                          │
                          ▼
                   Protected Routes
```

Passwords are hashed using bcrypt before being stored in the database.

After successful login, the backend generates a JWT that is used to authenticate protected requests.

---

## Real-Time Messaging Flow

```text
User A
  │
  │ Send Message
  ▼
React Client
  │
  │ REST Request
  ▼
Express Backend
  │
  ├──────────────► MongoDB
  │                  │
  │                  └── Store Message
  │
  └──────────────► Socket.IO
                       │
                       ▼
                    User B
                       │
                       ▼
                 React Client
                       │
                       ▼
                 Chat Updates
```

When a user sends a message:

1. The client sends the message to the backend.
2. The backend validates the authenticated user.
3. The message is stored in MongoDB.
4. Socket.IO sends the message to the recipient's active connection.
5. The recipient's interface updates without requiring a page refresh.

---

## Online Presence Flow

```text
User Opens App
      │
      ▼
Socket.IO Connection
      │
      ▼
User ID → Socket ID
      │
      ▼
Broadcast Online Users
      │
      ▼
Clients Update Status
      │
      ▼
User Disconnects
      │
      ▼
Check Active Connections
      │
   ┌──┴───────────┐
   │              │
Sockets Exist   No Sockets
   │              │
   ▼              ▼
Stay Online    Mark Offline
```

The server maintains active socket connections for each user.

This allows VibeChat to handle multiple active connections for the same account, such as multiple browser tabs or sessions.

A user is considered offline only after all active socket connections for that user have disconnected.

---

## Image Messaging Flow

```text
Select Image
      │
      ▼
React Client
      │
      ▼
Prepare Image Data
      │
      ▼
Express Backend
      │
      ▼
Cloudinary
      │
      ▼
Secure Image URL
      │
      ├────────────► MongoDB
      │
      └────────────► Socket.IO
                          │
                          ▼
                       Recipient
```

Images are uploaded through the backend to Cloudinary.

The resulting secure URL is stored with the message in MongoDB and delivered to the recipient through Socket.IO.

---

## Database Design

### User

```text
User
├── email
├── fullName
├── password
├── profilePic
├── bio
├── hiddenUsers[]
└── timestamps
```

### Message

```text
Message
├── senderId
├── receiverId
├── text
├── image
├── seen
└── timestamps
```

The `senderId` and `receiverId` fields establish the relationship between users.

The `seen` field is used to track whether a message has been viewed by the recipient.

---

## API Reference

### Authentication

| Method | Endpoint                   | Purpose                     |
| ------ | -------------------------- | --------------------------- |
| POST   | `/api/auth/signup`         | Register a new user         |
| POST   | `/api/auth/login`          | Authenticate a user         |
| GET    | `/api/auth/check`          | Check authentication status |
| PUT    | `/api/auth/update-profile` | Update user profile         |

### Messages & Conversations

| Method | Endpoint                         | Purpose                   |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/messages/users`            | Get available users       |
| GET    | `/api/messages/:id`              | Get conversation messages |
| POST   | `/api/messages/send/:id`         | Send a message            |
| PUT    | `/api/messages/mark/:id`         | Mark messages as seen     |
| DELETE | `/api/messages/conversation/:id` | Delete conversation       |
| DELETE | `/api/messages/friend/:id`       | Hide/delete a contact     |
| PUT    | `/api/messages/friend/:id`       | Restore a contact         |

---

## Project Structure

```text
VibeChat/
│
├── client/
│   ├── public/
│   └── src/
│       │
│       ├── components/
│       │   ├── ChatContainer.jsx
│       │   ├── ConfirmDialog.jsx
│       │   ├── RightSidebar.jsx
│       │   └── Sidebar.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── AuthContextValue.js
│       │   ├── ChatContext.jsx
│       │   └── ChatContextValue.js
│       │
│       ├── lib/
│       │   └── utils.js
│       │
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   └── ProfilePage.jsx
│       │
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── server/
│   │
│   ├── controllers/
│   │   ├── messageController.js
│   │   └── userController.js
│   │
│   ├── lib/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── utils.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Message.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   │
│   └── server.js
│
└── README.md
```

---

## Key Technical Decisions

### React

React is used to build the component-based user interface and manage dynamic application state.

### Context API

The application uses React Context to manage authentication and chat-related state across components without unnecessary prop drilling.

### Express.js

Express provides the backend REST API and handles authentication, user management, messages, and conversation operations.

### MongoDB + Mongoose

MongoDB provides persistent storage for users and messages, while Mongoose provides schema definitions and database interaction.

### JWT

JSON Web Tokens are used to authenticate users and protect private API routes.

### bcrypt

bcrypt is used to hash passwords before storing them in the database.

### Socket.IO

Socket.IO provides event-based real-time communication for:

* New messages
* Online users
* Connection management
* Real-time UI updates

### Cloudinary

Cloudinary provides external image storage for profile pictures and chat images.

---

## Conversation Management

VibeChat separates conversation data from contact visibility.

Users can:

* Delete a conversation
* Hide a contact
* Restore a hidden contact
* View shared media
* Track unread messages

Hidden contacts are maintained through the `hiddenUsers` field in the user document.

Deleting a conversation removes the associated messages, while hiding a contact controls whether that user appears in the current user's chat interface.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB account/database
* Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/VibeChat.git
cd VibeChat
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

### 5. Configure Frontend Environment Variables

Create a `.env` file inside the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 6. Start the Backend

```bash
cd server
npm run server
```

### 7. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will start using the Vite development server.

---

## Environment Variables

### Server

| Variable                | Description                    |
| ----------------------- | ------------------------------ |
| `MONGODB_URI`           | MongoDB connection string      |
| `JWT_SECRET`            | Secret used to sign JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name          |
| `CLOUDINARY_API_KEY`    | Cloudinary API key             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret          |
| `PORT`                  | Backend server port            |

### Client

| Variable           | Description          |
| ------------------ | -------------------- |
| `VITE_BACKEND_URL` | Backend API base URL |

Never commit `.env` files or real API credentials to GitHub.

---

## Security

VibeChat follows several basic security practices:

* Passwords are hashed using bcrypt.
* Protected routes require JWT authentication.
* Sensitive configuration is stored using environment variables.
* MongoDB credentials are kept on the server.
* Cloudinary credentials are kept on the server.
* Authentication middleware protects private backend operations.
* `.env` files should not be committed to the repository.

---

## Future Improvements

Planned improvements could include:

* Group conversations
* Typing indicators
* Message reactions
* Message editing
* Message search
* Push notifications
* Read receipts
* Voice and video calling
* Message pagination
* End-to-end encryption

---

## What This Project Demonstrates

VibeChat demonstrates practical experience with:

* Full-stack MERN development
* REST API development
* JWT authentication
* Password security
* MongoDB data modeling
* React state management
* Context API
* Real-time communication with Socket.IO
* Cloud-based image storage
* Responsive UI development
* Client-server communication
* Conversation and user management

---

## Author

Developed by Nagender Singh

GitHub: NagenderSingh08
Project: VibeChat
Built with: MERN Stack + Socket.IO

---

## License

This project is available for educational and portfolio purposes.
