const Tour = require('./../models/tourModel');

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
