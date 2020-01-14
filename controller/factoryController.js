const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ApiFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(new AppError('No document is found with the given id', 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc)
      return next(new AppError('No document is found with the given id.', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc)
      return next(new AppError('No document found with the given id', 400));
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tourId: req.params.tourId };

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query);

    apiFeatures
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await apiFeatures.query;

    res.status(200).json({
      status: 'success',
      data: {
        length: doc.length,
        data: doc
      }
    });
  });
