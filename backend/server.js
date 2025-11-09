const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const trainRoutes = require('./routes/trains');
const bookingRoutes = require('./routes/bookings');
const stationRoutes = require('./routes/stations');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow requests from any origin for EC2 deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Railway Station Management API',
    version: '1.0.0',
    endpoints: {
      trains: '/api/trains',
      bookings: '/api/bookings',
      stations: '/api/stations'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Railway Station Management API v1',
    endpoints: {
      trains: {
        getAll: 'GET /api/trains',
        getById: 'GET /api/trains/:id',
        search: 'GET /api/trains/search?origin=&destination=',
        create: 'POST /api/trains',
        update: 'PUT /api/trains/:id',
        delete: 'DELETE /api/trains/:id'
      },
      bookings: {
        getAll: 'GET /api/bookings',
        getById: 'GET /api/bookings/:id',
        getByEmail: 'GET /api/bookings/search?email=',
        create: 'POST /api/bookings',
        update: 'PUT /api/bookings/:id',
        cancel: 'PATCH /api/bookings/:id/cancel',
        delete: 'DELETE /api/bookings/:id'
      },
      stations: {
        getAll: 'GET /api/stations',
        getById: 'GET /api/stations/:id',
        getByCode: 'GET /api/stations/code/:code',
        search: 'GET /api/stations/search?city=',
        create: 'POST /api/stations',
        update: 'PUT /api/stations/:id',
        delete: 'DELETE /api/stations/:id'
      }
    }
  });
});

// Mount routes
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stations', stationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Railway Station Management API Server                     ║
╠════════════════════════════════════════════════════════════╣
║  Server running on port ${PORT}                              ${PORT >= 10000 ? '' : ' '}║
║  Environment: ${process.env.NODE_ENV || 'development'}                             ${(process.env.NODE_ENV || 'development').length > 11 ? '' : ' '.repeat(11 - (process.env.NODE_ENV || 'development').length)}║
║  CORS enabled for: ${process.env.FRONTEND_URL || '*'}                    ${(process.env.FRONTEND_URL || '*').length > 20 ? '' : ' '.repeat(20 - (process.env.FRONTEND_URL || '*').length)}║
╠════════════════════════════════════════════════════════════╣
║  API Endpoints:                                            ║
║    - GET  /api/trains          (List all trains)           ║
║    - GET  /api/bookings        (List all bookings)         ║
║    - GET  /api/stations        (List all stations)         ║
║    - GET  /api                 (API documentation)         ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
