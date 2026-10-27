const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

const borrowRoutes = require('./routes/borrowRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/borrow', borrowRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library Management API is running...",
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Invalid MongoDB ID (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found. Invalid ID format';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
});

module.exports = app;