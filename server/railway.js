const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(__dirname, '..') });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with more permissive settings for Railway
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["*"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e6,
  allowRequest: (req, callback) => {
    // Allow all requests
    callback(null, true);
  }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["*"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    socketio: 'enabled'
  });
});

// API endpoint to check server status
app.get('/api/status', (req, res) => {
  res.json({
    server: 'running',
    websocket: 'available',
    sessions: sessions.size,
    users: users.size,
    socketio_path: '/socket.io/'
  });
});

// Store active sessions and users
const sessions = new Map();
const users = new Map();

// Generate user names
const userNames = [
  'Alex', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage',
  'River', 'Phoenix', 'Blake', 'Cameron', 'Hayden', 'Rowan', 'Skyler'
];

function getRandomUserName() {
  return userNames[Math.floor(Math.random() * userNames.length)];
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id, 'from:', socket.handshake.address);

  socket.on('join-session', (sessionId) => {
    console.log(`User ${socket.id} joining session ${sessionId}`);
    
    // Leave any existing rooms
    const currentRooms = Array.from(socket.rooms).filter(room => room !== socket.id);
    currentRooms.forEach(room => socket.leave(room));

    // Join the new session room
    socket.join(sessionId);

    // Create user object
    const userName = getRandomUserName();
    const user = {
      id: socket.id,
      name: userName,
      sessionId: sessionId,
      isTyping: false
    };

    users.set(socket.id, user);

    // Initialize or update session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        id: sessionId,
        users: new Map(),
        texts: new Map(),
        createdAt: new Date()
      });
    }

    const session = sessions.get(sessionId);
    session.users.set(socket.id, user);

    // Send current user info and session users to the joining user
    const sessionUsers = Array.from(session.users.values());
    socket.emit('user-joined', {
      users: sessionUsers,
      currentUser: user
    });

    // Notify other users in the session
    socket.to(sessionId).emit('user-joined', {
      users: sessionUsers,
      currentUser: null
    });

    // Send existing text content to the new user
    if (session.texts.size > 0) {
      session.texts.forEach((text, userId) => {
        if (userId !== socket.id) {
          socket.emit('text-update', { userId, text });
        }
      });
    }

    console.log(`Session ${sessionId} now has ${session.users.size} users`);
  });

  socket.on('text-change', (data) => {
    const { sessionId, text, userId } = data;
    const user = users.get(socket.id);

    if (user && user.sessionId === sessionId) {
      const session = sessions.get(sessionId);
      if (session) {
        // Store the text for this user
        session.texts.set(socket.id, text);
        
        // Broadcast to other users in the session
        socket.to(sessionId).emit('text-update', {
          userId: socket.id,
          text: text
        });
      }
    }
  });

  socket.on('typing', (data) => {
    const { sessionId, isTyping, userId } = data;
    const user = users.get(socket.id);

    if (user && user.sessionId === sessionId) {
      // Update user's typing status
      user.isTyping = isTyping;
      
      const session = sessions.get(sessionId);
      if (session) {
        session.users.set(socket.id, user);
        
        // Broadcast typing status to other users
        socket.to(sessionId).emit('typing-status', {
          userId: socket.id,
          isTyping: isTyping
        });
      }
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'reason:', reason);
    
    const user = users.get(socket.id);
    if (user) {
      const sessionId = user.sessionId;
      const session = sessions.get(sessionId);
      
      if (session) {
        // Remove user from session
        session.users.delete(socket.id);
        session.texts.delete(socket.id);
        
        // Notify remaining users
        const remainingUsers = Array.from(session.users.values());
        socket.to(sessionId).emit('user-left', {
          users: remainingUsers
        });
        
        // Clean up empty sessions
        if (session.users.size === 0) {
          sessions.delete(sessionId);
          console.log(`Cleaned up empty session: ${sessionId}`);
        }
      }
      
      users.delete(socket.id);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error for', socket.id, ':', error);
  });
});

// Clean up old sessions periodically (every hour)
setInterval(() => {
  const now = new Date();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  sessions.forEach((session, sessionId) => {
    if (now - session.createdAt > maxAge && session.users.size === 0) {
      sessions.delete(sessionId);
      console.log(`Cleaned up old session: ${sessionId}`);
    }
  });
}, 60 * 60 * 1000); // Run every hour

const PORT = process.env.PORT || 3001;

// Prepare Next.js and start server
nextApp.prepare().then(() => {
  // Handle all other requests with Next.js
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`⚡ WebSocket ready on /socket.io/`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});