const express = require('express');
const router = express.Router();
const { addReview ,getReviews } = require('./reviewController');
const { verifyToken } = require('./../middleware/tokenutils');

router.post('/add', verifyToken, addReview);
router.get('/', getReviews);
module.exports = router;
