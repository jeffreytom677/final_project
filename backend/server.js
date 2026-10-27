const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB, disconnectDB } = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*', // Allow requests from any origin or React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Recipe Book API is operational',
    timestamp: new Date().toISOString()
  });
});

// Recipe Routes
app.use('/api/recipes', recipeRoutes);

// Catch 404 for undefined routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start server after connecting to database
let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🍳 Recipe Book Backend Server is running!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`📋 API Endpoint: http://localhost:${PORT}/api/recipes`);
      console.log(`==================================================\n`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle process termination gracefully
const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();

module.exports = app;
