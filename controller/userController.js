const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

// Update the login user
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) check if body contains password and confirmPassword
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password update. Please use to /updateMyPassword route',
        400
      )
    );

  // 2) filter out the unnecessary fields from req.body
  const filteredObj = filterObj(req.body, 'name', 'email');

  // 3) update the user
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true
  });

  // 4) send back the response
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not implemented yet!'
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not implemented yet!'
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not implemented yet!'
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not implemented yet!'
  });
});
