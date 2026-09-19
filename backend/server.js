const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const petRoutes = require('./routes/petRoutes');
const taskRoutes = require('./routes/taskRoutes');
dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());

// CORS Middleware
app.use(cors());

// Mount API Routes
app.use('/api/pets', petRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Server and Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Pet Care Tracker API running on http://localhost:${PORT}`);
  });
});
