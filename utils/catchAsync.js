const catchAsync = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};

module.exports = catchAsync;
