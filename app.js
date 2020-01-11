const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('natours:app');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controller/errorController');

const app = express();

// Global Middleware

// Set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

// Limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again after an hour'
});

app.use(limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against noSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Global error handler
app.use(errorController);

module.exports = app;
