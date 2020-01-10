const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getTours = catchAsync(async (req, res, next) => {
  // 1) Filter the documents

  // Basic Filtering
  // remove page, limit, fields and sort fields from req.query
  let queryObj = { ...req.query };
  const features = ['limit', 'sort', 'page', 'fields'];
  features.forEach(el => {
    delete queryObj[el];
  });

  // Advanced Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  queryObj = JSON.parse(queryStr);

  // Sorting

  const tours = await Tour.find(queryObj);
  // const tours = await Tour.find({});
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
