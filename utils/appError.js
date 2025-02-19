class AppError {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // Error.captureStackTrace(this, this.constructor);
    this.stack = new Error(message).stack;
  }
}

module.exports = AppError;
