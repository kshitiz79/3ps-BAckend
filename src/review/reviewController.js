const Review = require('./review.model');

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
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

    const newReview = await Review.create({
      user: req.userId,
      rating,
      review,
    });

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

// Edit a review
exports.editReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID
    const { rating, review } = req.body;

    const updatedReview = await Review.findOneAndUpdate(
      { _id: id, user: req.userId }, // Ensure the user owns the review
      { rating, review },
      { new: true } // Return the updated document
    ).populate('user', 'username');

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found or not authorized to edit' });
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a review

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure review exists before deleting
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review.",
      error: error.message,
    });
  }
};
