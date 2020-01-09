const router = require('express').Router();
const tourController = require('./../controller/tourController');

router
  .route('/')
  .get(tourController.getTours)
  .post(tourController.createTour);

router.route('/:id').get(tourController.getTour);

module.exports = router;
