# Chat App - Backend

This is the backend server for a real-time 1:1 chat application built with Node.js, Express, TypeScript, MongoDB, and Socket.IO.

## 🚀 Features

- **TypeScript** - Type safety and better developer experience
- **JWT Authentication** - Secure user authentication with JSON Web Tokens
- **Real-time Messaging** - Instant message delivery with Socket.IO
- **Online Status** - Track user availability in real-time
- **Typing Indicators** - See when other users are typing
- **Message Read Receipts** - Know when messages are read
- **RESTful API** - Clean and consistent API design
- **Input Validation** - Request validation with express-validator
- **Error Handling** - Comprehensive error handling middleware
- **CORS** - Secure cross-origin resource sharing
- **WebSocket Authentication** - Secure real-time communication
- **MongoDB** - Scalable NoSQL database
- **Environment Configuration** - Easy configuration management
- **API Documentation** - Comprehensive API documentation
- **Testing** - Automated test suite

## 🛠 Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB (local or cloud instance)
- TypeScript (installed as a dev dependency)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGO_URI=mongodb://localhost:27017/chat-app
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   
   # CORS
   CLIENT_URL=http://localhost:3000
   
   # Logging
   LOG_LEVEL=debug
   ```

4. **Development**
   ```bash
   # Start the development server with hot-reload
   npm run dev
   ```
   The server will be available at `http://localhost:5000`

5. **Production Build**
   ```bash
   # Install production dependencies
   npm ci --only=production
   
   # Build the TypeScript code
   npm run build
   
   # Start the production server
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/           # Configuration files (database, environment, etc.)
├── controllers/      # Route controllers (auth, messages, etc.)
├── middleware/       # Custom middleware (auth, validation, error handling)
├── models/           # Database models (User, Message)
├── routes/           # API route definitions
├── types/            # TypeScript type definitions
└── server.ts         # Main application entry point
```

## 📚 API Documentation

### Authentication

#### Register a New User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Messages

#### Send a Message
```
POST /api/messages
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "receiverId": "60d21b4667d0d8992e610c85",
  "content": "Hello, how are you?"
}
```

#### Get Messages with a User
```
GET /api/messages/:userId
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### Get All Conversations
```
GET /api/messages/conversations
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## 🔌 WebSocket Events

### Client to Server
- `typing` - Notify when a user starts typing
- `stopTyping` - Notify when a user stops typing
- `message` - Send a new message
- `readMessage` - Mark a message as read

### Server to Client
- `newMessage` - New message received
- `messageRead` - Message was read by recipient
- `userOnline` - User came online
- `userOffline` - User went offline
- `userTyping` - User is typing
- `userStoppedTyping` - User stopped typing

## 🧪 Testing

### Run Tests
```bash
# Install test dependencies
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest

# Run tests
npm test
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment with PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/server.js --name "chat-app-backend"

# Save the PM2 process list
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

## 📝 Environment Variables

| Variable     | Description                     | Default                     |
|--------------|---------------------------------|----------------------------|
| NODE_ENV     | Node environment                | development                |
| PORT         | Server port                     | 5000                       |
| MONGO_URI    | MongoDB connection string        | mongodb://localhost:27017/chat-app |
| JWT_SECRET   | Secret key for JWT signing      | -                          |
| JWT_EXPIRE   | JWT expiration time             | 30d                        |
| CLIENT_URL   | Frontend URL for CORS           | http://localhost:3000      |
| LOG_LEVEL    | Logging level                   | debug                      |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Contributors

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

## API Documentation

### Authentication

#### Register a new user
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "isOnline": true
  }
}
```

### Messages

#### Send a message
```
POST /api/messages
```
**Headers:**
```
Authorization: Bearer <jwt_token>
```
**Request Body:**
```json
{
  "receiverId": "recipient_user_id",
  "content": "Hello, how are you?"
}
```

#### Get messages between users
```
GET /api/messages/:userId
```
**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### Get all conversations
```
GET /api/messages/conversations
```
**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Socket.IO Events

### Client to Server
- `typing` - Notify when a user starts typing
- `stopTyping` - Notify when a user stops typing

### Server to Client
- `newMessage` - New message received
- `userOnline` - User came online
- `userOffline` - User went offline
- `userTyping` - User is typing
- `userStoppedTyping` - User stopped typing

## Environment Variables

| Variable     | Description                     | Default                     |
|--------------|---------------------------------|----------------------------|
| PORT         | Server port                     | 5000                       |
| MONGO_URI    | MongoDB connection string        | mongodb://localhost:27017/chat-app |
| JWT_SECRET   | Secret key for JWT signing      | your_jwt_secret_key_here   |
| CLIENT_URL   | Frontend URL for CORS           | http://localhost:3000      |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Request body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

- `POST /api/auth/login` - Login user
  - Request body: `{ "email": "john@example.com", "password": "password123" }`

### Users

- `GET /api/users` - Get all users (except the logged-in user)
  - Requires authentication header: `Authorization: Bearer <token>`

## Socket.IO Events

### Client to Server
- `sendMessage` - Send a message to a user
  ```javascript
  {
    receiverId: 'user_id_here',
    text: 'Hello!'
  }
  ```
- `typing` - Notify when user is typing
  ```javascript
  {
    receiverId: 'user_id_here',
    isTyping: true/false
  }
  ```

### Server to Client
- `receiveMessage` - Receive a new message
  ```javascript
  {
    message: {
      _id: 'message_id',
      senderId: { _id: 'user_id', name: 'Sender Name', email: 'sender@example.com' },
      receiverId: 'receiver_id',
      text: 'Hello!',
      isRead: false,
      createdAt: '2023-01-01T00:00:00.000Z'
    }
  }
  ```
- `userTyping` - When a contact is typing
  ```javascript
  {
    senderId: 'user_id_here',
    isTyping: true/false
  }
  ```
- `userOnline` - When a user comes online
  ```javascript
  { userId: 'user_id_here' }
  ```
- `userOffline` - When a user goes offline
  ```javascript
  { userId: 'user_id_here' }
  ```

## Client-Side Implementation Example

```javascript
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://your-server-url', {
  auth: {
    token: 'your_jwt_token_here'
  }
});

// Listen for new messages
socket.on('receiveMessage', (data) => {
  console.log('New message:', data.message);
});

// Send a message
const sendMessage = (receiverId, text) => {
  socket.emit('sendMessage', { receiverId, text }, (response) => {
    if (response.error) {
      console.error('Error sending message:', response.error);
    } else {
      console.log('Message sent:', response.message);
    }
  });
};

// Typing indicator
const setTyping = (receiverId, isTyping) => {
  socket.emit('typing', { receiverId, isTyping });
};
```

## Environment Variables

- `PORT` - Port on which the server will run (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `CLIENT_URL` - URL of your frontend application (for CORS)

## Development

To start the development server with hot-reload:

```bash
npm run dev
```

## Production

To start the production server:

```bash
npm start
```

## Testing Socket.IO

1. Open two different browser windows (or use Postman with WebSocket support)
2. Log in with different users in each window
3. Send messages between users in real-time
4. Test typing indicators
5. Check online/offline status by opening/closing windows

## Error Handling

- 400 Bad Request - Invalid input data
- 401 Unauthorized - No token provided or invalid token
- 500 Internal Server Error - Server error
