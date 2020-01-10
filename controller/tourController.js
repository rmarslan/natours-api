const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ApiFeatures = require('./../utils/apiFeatures');

exports.getTours = catchAsync(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Tour.find(), req.query);
  apiFeatures
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    data: {
      length: tours.length,
      tours: tours
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    tour
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id: tourId } = req.params;
  const tour = await Tour.findById(tourId);
  if (!tour) return next(new AppError('No tour found with the given id', 400));
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!tour)
    return next(new AppError('No tour is found with the given id.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour)
    return next(new AppError('No tour is found with the given id', 404));

  res.status(204).json({
    status: 'success',
    data: null
  });
});
