const mongoose = require('mongoose');
const crypto = require('crypto');
const debug = require('debug')('natours:userModel');
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
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guide', 'lead-guide'],
      message: 'User role must be either user|admin|guide|lead-guide'
    },
    default: 'user',
    select: false
  },
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiresIn: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// Run this function every time password is modified
//Document Middleware: Runs when Save document and create document

// Set the changed password field for documents whose password is updated
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function(next) {
  // Check if password is modified
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  // Remove The PasswordConfirm
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
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

userSchema.methods.passwordChangedAfter = function(jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    debug('Password changed at: ', changedTimeStamp);
    debug('Token issued at', jwtTimeStamp);
    return changedTimeStamp > jwtTimeStamp;
  }
};

userSchema.methods.generateSetPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  debug('Plain reset token: ', resetToken);
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  debug('Crypt Password Reset Token: ', this.passwordResetToken);
  return resetToken;
};

//==========================
// verify the JWT token
userSchema.statics.verifyToken = function(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get('jwtSecretKey'), (err, payload) => {
      if (!err) resolve(payload);
      else {
        reject(err);
      }
    });
  });
};

userSchema.statics.generatePasswordResetToken = function(token) {
  if (token) {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
