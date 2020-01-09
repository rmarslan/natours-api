const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const debugServer = require('debug')('natours:server');
const debugDB = require('debug')('natours:database');
const config = require('config');
const mongoose = require('mongoose');

// Required Environment variables
if (!process.env.NODE_ENV) {
  debugServer(`FATAL ERROR: Please set the NODE_ENV environment variable.`);
  process.exit(1);
}

// Requiring the app module
const app = require('./app');

// Connect to the database
// config.get throws an exception if it not found the {required variable}
const dbHost = config.get('db.host');
const dbName = config.get('db.name');

const dbConnectionString = `mongodb://${dbHost}/${dbName}`;
debugDB(dbConnectionString);

mongoose
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => debugDB('Connected to the database.'));

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  debugServer(`Server is listening on ${port}...`);
});
