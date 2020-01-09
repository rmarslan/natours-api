const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('natours:app');
const tourRouter = require('./routes/tourRoute');

const app = express();

// Middleware
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

app.use('/tours/api/v1', tourRouter);

module.exports = app;
