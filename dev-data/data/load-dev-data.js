const dotenv = require('dotenv');
// Set environment variables
dotenv.config({
  path: `${__dirname}/../../config.env`
});

// Require packages
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('config');
const debug = require('debug')('natours:importDevData');
const Tour = require('./../../models/tourModel');

// Connect to the database
const dbHost = config.get('db.host');
const dbName = config.get('db.name');
const conString = `mongodb://${dbHost}/${dbName}`;
debug(conString);
mongoose
  .connect(conString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => debug('Connected to the database.'));

// Load the data from file
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into database
const importData = async () => {
  try {
    await Tour.create(data);
    debug('Tours imported successfully.');
    process.exit(0);
  } catch (err) {
    debug(err);
    process.exit(1);
  }
};

// Delete data from database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    debug('Tours deleted successfully.');
    process.exit(0);
  } catch (err) {
    debug(err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
