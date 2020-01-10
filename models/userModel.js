const mongoose = require('mongoose');
const config = require('config');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    minlength: [3, 'User name must have at least 3 characters'],
    maxlength: [50, 'User name must be less or equal to 50 characters'],
    match: [/^[a-z A-Z]+$/, 'User name must consists of only alphabets'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long'],
    maxlength: 1025,
    required: [true, 'Please provide a password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(v) {
        return this.password === v;
      },
      message: 'Passwords are not same'
    }
  }
});

// Run this function every time password is modified
//Document Middleware: Runs when Save document and create document
userSchema.pre('save', async function(next) {
  // Check if password is modified
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  // Remove The PasswordConfirm
  this.passwordConfirm = undefined;

  next();
});

// ========================
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ userId: this._id }, config.get('jwtSecretKey'), {
    expiresIn: config.get('jwt.expiresIn')
  });
};

userSchema.methods.isPasswordValid = function(candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
