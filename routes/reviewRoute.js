const router = require('express').Router({ mergeParams: true });
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
