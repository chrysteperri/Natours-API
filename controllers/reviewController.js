const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// Route Handlers
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes: POST /tours/:tourId/reviews
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.validateTourExists = catchAsync(async (req, res, next) => {
  const tourId = req.body.tour || req.params.tourId;
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError('Cannot create review: Tour does not exist', 404));
  }
  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
