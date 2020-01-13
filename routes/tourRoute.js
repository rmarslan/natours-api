const router = require('express').Router();
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./reviewRoute');

router.use('/:tourId/reviews', reviewRouter);

router.get(
  '/top-5-cheap',
  tourController.aliasTopCheapTours,
  tourController.getTours
);

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// tours/:tourId/reviews

module.exports = router;
