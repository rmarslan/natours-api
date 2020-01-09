const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('natours:app');

const app = express();

// Middleware
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello World</h1>');
});

module.exports = app;
