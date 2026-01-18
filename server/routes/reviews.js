// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { title, rating, comment, product, reviewerName, reviewerEmail } = req.body;

    // Validate required fields
    if (!title || !rating || !comment || !product || !reviewerName || !reviewerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Title, rating, comment, product, reviewerName, and reviewerEmail are required'
      });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${product}`
      });
    }

    // Create new review
    const review = new Review({
      title,
      rating,
      comment,
      product,
      reviewerName,
      reviewerEmail
    });

    await review.save();

    console.log(`✅ Review created for product: ${productExists.name}`);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    console.error('❌ Error creating review:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews (optionally filter by product)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { product, rating, minRating } = req.query;

    let query = { isActive: true };

    if (product) {
      query.product = product;
    }

    if (rating) {
      query.rating = Number(rating);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const reviews = await Review.find(query)
      .populate('product', 'name price category')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Retrieved ${reviews.length} reviews`);

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/reviews/:id
 * @desc    Get a single review by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'name price category icon');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
        message: `No review found with ID: ${req.params.id}`
      });
    }

    console.log(`✅ Retrieved review: ${review.title}`);

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('❌ Error fetching review:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid review ID',
        message: 'The provided ID is not valid'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review by ID
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { title, rating, comment, helpful, isActive } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
        message: `No review found with ID: ${req.params.id}`
      });
    }

    // Update fields
    if (title !== undefined) review.title = title;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (helpful !== undefined) review.helpful = helpful;
    if (isActive !== undefined) review.isActive = isActive;

    await review.save();

    console.log(`✅ Review updated: ${review.title} (ID: ${review._id})`);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    console.error('❌ Error updating review:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid review ID',
        message: 'The provided ID is not valid'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
        message: `No review found with ID: ${req.params.id}`
      });
    }

    const reviewTitle = review.title;
    await review.deleteOne();

    console.log(`✅ Review deleted: ${reviewTitle} (ID: ${req.params.id})`);

    res.json({
      success: true,
      message: 'Review deleted successfully',
      data: {
        id: req.params.id,
        title: reviewTitle
      }
    });

  } catch (error) {
    console.error('❌ Error deleting review:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid review ID',
        message: 'The provided ID is not valid'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/reviews/product/:productId
 * @desc    Get all reviews for a specific product
 * @access  Public
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isActive: true 
    })
    .populate('product', 'name')
    .sort({ createdAt: -1 })
    .lean();

    console.log(`✅ Retrieved ${reviews.length} reviews for product ${req.params.productId}`);

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    console.error('❌ Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

module.exports = router;