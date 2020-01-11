const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('natours:app');
const rateLimit = require('express-rate-limit');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controller/errorController');

const app = express();

// Global Middleware
app.use(express.json());
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again after an hour'
});

app.use(limiter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Global error handler
app.use(errorController);

module.exports = app;
