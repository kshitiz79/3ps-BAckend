const Review = require('./review.model');

// Get all reviews
// Controller: Get all reviews with populated user field
exports.getReviews = async (req, res) => {
  try {
    // Fetch reviews and populate the `user` field with `username`
    const reviews = await Review.find().populate('user', 'username');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    // Create a new review with the logged-in user's ID
    const newReview = await Review.create({
      user: req.userId, // Use the logged-in user's ID
      rating,
      review,
    });

    // Populate the `user` field to include the `username`
    const populatedReview = await Review.findById(newReview._id).populate('user', 'username');

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

