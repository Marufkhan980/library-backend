const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please add an author name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN number'],
    unique: true,
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please add a published year'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please add available copies'],
    min: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Book', bookSchema);