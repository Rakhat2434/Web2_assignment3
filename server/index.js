// server/index.js (Assignment 3 - MongoDB Version)
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// DATABASE CONNECTION
// ===================================
connectDB();

// ===================================
// MIDDLEWARE
// ===================================
// app.use(cors()); // Commented out to match your original
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===================================
// API ROUTES
// ===================================

// Import routes
const weatherRoutes = require('./routes/weather');
const newsRoutes = require('./routes/news');
const currencyRoutes = require('./routes/currency');
const productsRoutes = require('./routes/products'); // MongoDB CRUD
const reviewsRoutes = require('./routes/reviews');   // Secondary CRUD

// Mount routes
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/reviews', reviewsRoutes);

// ===================================
// ADDITIONAL ENDPOINTS
// ===================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    database: 'MongoDB',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ===================================
// SERVE FRONTEND
// ===================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ===================================
// ERROR HANDLING
// ===================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===================================
// START SERVER
// ===================================
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║        Assignment 3 - MongoDB Version        ║
  ║                                               ║
  ║     Server running on port ${PORT}              ║
  ║     http://localhost:${PORT}                    ║
  ║                                               ║
  ║     API Endpoints:                            ║
  ║     • GET /api/health                         ║
  ║     • GET /api/weather/:city                  ║
  ║     • GET /api/news                           ║
  ║     • GET /api/currency/:from/:to             ║
  ║     • GET /api/products                       ║
  ║                                               ║
  ║     CRUD Endpoints (Products):                ║
  ║     • POST   /api/products                    ║
  ║     • GET    /api/products                    ║
  ║     • GET    /api/products/:id                ║
  ║     • PUT    /api/products/:id                ║
  ║     • DELETE /api/products/:id                ║
  ║                                               ║
  ║     CRUD Endpoints (Reviews):                 ║
  ║     • POST   /api/reviews                     ║
  ║     • GET    /api/reviews                     ║
  ║     • GET    /api/reviews/:id                 ║
  ║     • PUT    /api/reviews/:id                 ║
  ║     • DELETE /api/reviews/:id                 ║
  ║                                               ║
  ║     Frontend:                                 ║
  ║     • http://localhost:${PORT}                  ║
  ║     • http://localhost:${PORT}/crud.html        ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);

  // Check for required environment variables
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  Warning: MONGODB_URI is not set in .env');
  }
  if (!process.env.OPENWEATHER_API_KEY) {
    console.warn('⚠️  Warning: OPENWEATHER_API_KEY is not set');
  }
  if (!process.env.NEWS_API_KEY) {
    console.warn('⚠️  Warning: NEWS_API_KEY is not set');
  }
  if (!process.env.EXCHANGERATE_API_KEY) {
    console.warn('⚠️  Warning: EXCHANGERATE_API_KEY is not set');
  }
});