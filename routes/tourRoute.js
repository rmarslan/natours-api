const router = require('express').Router();
const tourController = require('./../controller/tourController');

router.route('/').get(tourController.getTours);

module.exports = router;
