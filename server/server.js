import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { handleSocketConnection } from './socket.js';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Game from './models/Game.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify environment variables
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Set default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not found in environment variables, using default secret');
  process.env.JWT_SECRET = 'default-jwt-secret-change-in-production';
}

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: "http://localhost:5173", // Updated to match Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Updated to match Vite's default port
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    console.log('Auth attempt with token:', token ? 'Token present' : 'No token');

    if (!token) {
      console.log('Authentication error: No token provided');
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('Authentication error: User not found');
      return next(new Error('Authentication error'));
    }

    socket.user = user;
    console.log('Socket authenticated for user:', user.username);
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error'));
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.user.username, 'Socket ID:', socket.id);
  handleSocketConnection(io, socket);
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
