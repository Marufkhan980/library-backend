const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getBorrowedBooks,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/borrowed-books').get(protect, getBorrowedBooks);

module.exports = router;