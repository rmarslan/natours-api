const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');

dotenv.config({ path: './config.env' });
const app = express();

// Middleware
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello World</h1>');
});

app.listen(3000, () => {
  debug('server is listening on port 3000...');
});
