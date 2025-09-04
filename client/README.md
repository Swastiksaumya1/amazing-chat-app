# Chat App Client

A real-time chat application built with React, TypeScript, Vite, and Socket.IO.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_APP_NAME="Chat App"
   VITE_API_URL="http://localhost:5000"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Features

- Real-time messaging with Socket.IO
- User authentication (login/register)
- Online/offline status
- Typing indicators
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Real-time**: Socket.IO Client
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

## Project Structure

```
/src
  /components      # Reusable UI components
  /context         # React context providers
  /hooks           # Custom React hooks
  /pages           # Page components
  /services        # API and service layer
  /types           # TypeScript type definitions
  /utils           # Utility functions
  App.tsx          # Main application component
  main.tsx         # Application entry point
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
