const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

// Borrow a book
// POST /api/borrow
// Private
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Check if available copies > 0
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing (0 copies left)',
      });
    }

    // Create borrow record
    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
    });

    // Decrease available copies by 1
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully.',
      data: borrow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Return a borrowed book
// PUT /api/borrow/:id/return
// Private
exports.returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found',
      });
    }

    if (borrow.status === 'Returned') {
      return res.status(400).json({
        success: false,
        message: 'Book is already returned',
      });
    }

    // Update borrow status & return date
    borrow.status = 'Returned';
    borrow.returnDate = Date.now();
    await borrow.save();

    // Increase available copies by 1
    const book = await Book.findById(borrow.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.status(200).json({
      success: true,
      message: 'Book returned successfully.',
      data: borrow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};