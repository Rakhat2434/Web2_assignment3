// server/config/database.js
const mongoose = require('mongoose');

/**
 * MongoDB Connection Configuration
 * Connects to MongoDB Atlas or local MongoDB instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   ✅ MongoDB Connected Successfully           ║
    ║   Host: ${conn.connection.host.padEnd(33)}║
    ║   Database: ${conn.connection.name.padEnd(29)}║
    ╚═══════════════════════════════════════════════╝
    `);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Please check your MONGODB_URI in .env file');
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;