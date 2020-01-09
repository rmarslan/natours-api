const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('natours:app');
const tourRouter = require('./routes/tourRoute');
const errorController = require('./controller/errorController');

const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

app.use('/tours/api/v1', tourRouter);

app.use(errorController);

module.exports = app;
