const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getTours = catchAsync(async (req, res, next) => {
  // 1) Filter the documents

  // 1a) Basic Filtering
  // remove page, limit, fields and sort fields from req.query
  let queryObj = { ...req.query };
  const features = ['limit', 'sort', 'page', 'fields'];
  features.forEach(el => {
    delete queryObj[el];
  });

  // 1b) Advanced Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  queryObj = JSON.parse(queryStr);

  // 2) Sorting
  let query = Tour.find(queryObj);
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 3) Limit Fields
  if (req.query.fields) {
    if (Array.isArray(req.query.fields)) {
      return next(new AppError('Invalid fields query parameter', 400));
    }
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 4) paginate page=2, limit=5
  const page = req.query.page * 1 || 1;
  const pageSize = req.query.limit * 1 || 5;

  // page = 2, pageSize = 5
  // page 1: 1-5,
  // page 2: 6-10,
  // page 3: 11-15

  const skip = (page - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);

  // Evaluate the query
  const tours = await query;
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
