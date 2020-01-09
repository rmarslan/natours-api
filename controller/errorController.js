const debug = require('debug')('natours:errorController');
const AppError = require('./../utils/appError');

const handleIdCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleMongooseValidationError = err => {
  const message = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // 1) log the error to the console
    debug(err);
    // 2) send the response
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV.trim() === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    if (error.name === 'ValidationError')
      error = handleMongooseValidationError(error);
    if (error.code === 11000) error = handleDuplicateKeyErrorDB(error);
    if (error.name === 'CastError') error = handleIdCastErrorDB(error);
    sendErrorProd(error, res);
  }
};
