const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getTours = async (req, res, next) => {
  const tours = await Tour.find({});
  res.status(200).json({
    status: 'success',
    data: {
      length: tours.length,
      tours: tours
    }
  });
};

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
    tour
  });
});
