const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true,
      minlength: 10,
      maxlength: 255
    },
    rating: {
      type: Number,
      required: [true, 'Please give rating to this tour'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    tourId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour ID is required']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({ path: 'userId', select: 'name photo' });
  //   this.populate({ path: 'tourId', select: 'name' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
