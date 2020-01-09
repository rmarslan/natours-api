const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');

dotenv.config({ path: './config.env' });
const app = express();

if (!process.env.NODE_ENV) {
  debug(`FATAL ERROR: Please set the NODE_ENV environment variable.`);
  process.exit(1);
}
// Middleware
if (process.env.NODE_ENV.trim() === 'development') {
  debug('Morgan is enabled');
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello World</h1>');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  debug(`Server is listening on ${port}...`);
});
