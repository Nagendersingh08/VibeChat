# VibeChat

VibeChat is a real-time chat application built using React, Node.js, Express.js, Socket.IO, and MongoDB.

## Features

- User authentication
- Real-time messaging
- One-to-one chat
- Online/offline user status
- User profiles
- Image sharing
- Responsive chat interface
- MongoDB database integration
- Real-time communication using Socket.IO

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose
- JWT Authentication

### Tools

- VS Code
- Git
- GitHub
- Postman
- Vercel

## Project Structure

```text
VibeChat/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nagendersingh08/VibeChat.git
cd VibeChat
```

### 2. Install Dependencies

Install the client dependencies:

```bash
cd client
npm install
```

Install the server dependencies:

```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

Add your required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not upload your `.env` file to GitHub.

### 4. Run the Application

Start the backend:

```bash
cd server
npm run server
```

Open another terminal and start the frontend:

```bash
cd client
npm run dev
```

The frontend will run using the Vite development server.


### Server

```bash
cd server
npm run server
```

## Security

Sensitive information such as database credentials, API keys, and JWT secrets should be stored in environment variables.

The following files and folders should not be uploaded to GitHub:

```text
.env
node_modules/
```

## Future Improvements

- Group chat
- Typing indicators
- Message read status
- Message reactions
- Push notifications
- Improved media sharing

## Author

Nagender Singh

GitHub: https://github.com/Nagendersingh08