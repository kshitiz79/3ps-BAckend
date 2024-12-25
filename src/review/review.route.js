const express = require('express');
const router = express.Router();
const { 
  addReview, 
  getReviews, 
  editReview, 
  deleteReview 
} = require('./reviewController');
const { verifyToken } = require('./../middleware/tokenutils');

// Route to add a review
router.post('/add', verifyToken, addReview);

// Route to get all reviews
router.get('/', getReviews);

// Route to edit a review
router.put('/edit/:id', verifyToken, editReview);

// Route to delete a review
router.delete('/delete/:id',  deleteReview);


module.exports = router;
