const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    trim: true,
    unique: true,
    minlength: [
      10,
      'Tour name must have greater than or equal to 10 characters.'
    ],
    maxlength: [40, 'Tour name must have less than or equal to 40 characters'],
    match: [/^[a-zA-Z]+$/, 'A tour name must have only alphabets [a-z, A-Z]']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
