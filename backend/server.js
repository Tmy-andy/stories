const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Store user connections
const userConnections = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their userId
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    userConnections[userId] = socket.id;
    console.log(`User ${userId} joined notification room`);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    // Remove user connection
    Object.keys(userConnections).forEach(userId => {
      if (userConnections[userId] === socket.id) {
        delete userConnections[userId];
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Trust proxy for getting real client IP
app.set('trust proxy', 1);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const storyRoutes = require('./routes/stories');
const chapterRoutes = require('./routes/chapters');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/comments');
const favoriteRoutes = require('./routes/favorites');
const notificationRoutes = require('./routes/notifications');
const readingHistoryRoutes = require('./routes/readingHistory');
const contactRoutes = require('./routes/contact');
const categoryRoutes = require('./routes/categories');
const managerAuthRoutes = require('./routes/manager');
const managerAPIRoutes = require('./routes/managerAPI');
const settingsRoutes = require('./routes/settings');

// Routes
app.use('/api/stories', storyRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reading-history', readingHistoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/manager', managerAuthRoutes);
app.use('/api/manager', managerAPIRoutes);
app.use('/api/settings', settingsRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({ message: 'Lam Điệp Cô Ảnh API Server' });
});

// Make io accessible to routes
app.locals.io = io;
app.locals.userConnections = userConnections;

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});