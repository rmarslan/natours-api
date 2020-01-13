const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ApiFeatures = require('./../utils/apiFeatures');

exports.aliasTopCheapTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage, price';
  req.query.limit = 5;
  req.query.fields = 'name, price, ratingsAverage, difficulty, summary';
  next();
};

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
  const tour = await Tour.findById(tourId).populate('reviews');
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

// Aggregations
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: -1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`01-01-${year}`),
          $lte: new Date(`12-31-${year}`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numTours: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      monthlyPlan
    }
  });
});
