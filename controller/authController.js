const debug = require('debug')('natours:authController');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const createSendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signupUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(user, 201, res);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  // 1) Check email and password exist
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // 2) check the user exist and verify the password
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.isPasswordValid(password, user.password))) {
    return next(new AppError('Invalid email or password', 400));
  }

  // 3) generate and send the token
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) check the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token)
    return next(
      new AppError('You are not logged in! please login to get access', 401)
    );

  // 2) validate the token
  const decoded = await User.verifyToken(token);

  // 3) check the user exists
  const user = await User.findById(decoded.userId).select('+role');
  debug('Found user', user);
  if (!user)
    return next(
      new AppError('The user belonging to this account no longer exists', 401)
    );

  // 4) check wether password change after token issued
  if (user.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        'User has recently changed the password. Please login again',
        401
      )
    );
  }

  // 5) Grant access
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) find the user by POSTed email
  if (!req.body.email) return next(new AppError('Please provide email', 400));
  debug('email', req.body.email);
  const user = await User.findOne({ email: req.body.email });
  debug('User', user);
  if (!user)
    return next(new AppError('No user exists belonging to this email', 400));

  // 2) Generate and set password reset token
  const resetToken = user.generateSetPasswordResetToken();
  debug('Reset Token: ', resetToken);
  await user.save({ validateBeforeSave: false });
  try {
    // 3) Send the email
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    debug('Password Reset URL: ', resetUrl);
    const message = `Forgot password? submit the patch request with your new password and password confirm to this url ${resetUrl}. If you didn't forget your password simply ignore this message.`;

    await sendEmail({
      email: user.email,
      subject: 'Reset Password Token (Valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to the email. Please check your email.'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email! try again latter.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
