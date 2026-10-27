const User = require('../models/User');
const Borrow = require('../models/Borrow');

// Get user profile
// GET /api/users/profile
// Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully.',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile (Name, Phone Number)
// PUT /api/users/profile
// Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: {
          _id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's borrowed books
// GET /api/users/borrowed-books
// Private
exports.getBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Borrow.find({ user: req.user._id }).populate('book');

    res.status(200).json({
      success: true,
      message: 'Borrowed books fetched successfully.',
      count: borrowedBooks.length,
      data: borrowedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};