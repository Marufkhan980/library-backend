const Book = require('../models/Book');

// Create a new book
// POST /api/books
// Private
exports.createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, publishedYear, description, availableCopies } = req.body;

    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      publishedYear,
      description,
      availableCopies,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully.',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all books with pagination, search, filter, sort
// GET /api/books
// Public
exports.getBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    let query = {};

    // Search by title (Case insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(query)
      .populate('createdBy', 'fullName email')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Books fetched successfully.',
      count: books.length,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single book by ID
// GET /api/books/:id
// Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('createdBy', 'fullName email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book fetched successfully.',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update book
// PUT /api/books/:id
// Private (Owner or Admin)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user is owner or admin
    if (book.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book',
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Book updated successfully.',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete book
// DELETE /api/books/:id
// Private (Owner or Admin)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if user is owner or admin
    if (book.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book',
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};