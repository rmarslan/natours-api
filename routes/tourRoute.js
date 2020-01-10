const router = require('express').Router();
const tourController = require('./../controller/tourController');

router.get(
  '/top-5-cheap',
  tourController.aliasTopCheapTours,
  tourController.getTours
);

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
