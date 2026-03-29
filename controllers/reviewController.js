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

exports.validateTourExistsOnReviews = catchAsync(async (req, res, next) => {
  if (!req.params.tourId) return next(); // Skip if not a nested route

  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  next();
});

exports.checkReviewOwnership = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Allow admin OR owner
  if (review.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError('You do not have permission to perform this action', 403),
    );
  }

  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
