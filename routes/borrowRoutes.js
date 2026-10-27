const express = require('express');
const { borrowBook, returnBook } = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, borrowBook);
router.route('/:id/return').put(protect, returnBook);

module.exports = router;