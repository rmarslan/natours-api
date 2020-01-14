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
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

//Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    debug('Data imported successfully.');
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
    await User.deleteMany();
    await Review.deleteMany();
    debug('Data deleted successfully.');
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
