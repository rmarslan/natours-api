const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

exports.protect = catchAsync(async (req, res, next) => {});
