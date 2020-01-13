const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tourId: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tourId) req.body.tourId = req.params.tourId;
  if (!req.body.userId) req.body.userId = req.user._id;
  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    userId: req.body.userId,
    tourId: req.body.tourId
  });

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});
