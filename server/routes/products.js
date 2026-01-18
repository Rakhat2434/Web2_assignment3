// server/routes/products.js (MongoDB Version)
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, price, description, category, icon, weather, stock, imageUrl } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name, price, description, and category are required'
      });
    }

    // Create new product
    const product = new Product({
      name,
      price,
      description,
      category,
      icon: icon || '📦',
      weather: weather || 'all',
      stock: stock || 0,
      imageUrl
    });

    // Save to database
    await product.save();

    console.log(`✅ Product created: ${product.name} (ID: ${product._id})`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('❌ Error creating product:', error);

    // Handle validation errors
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
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, weather, minPrice, maxPrice, active } = req.query;

    // Build query
    let query = {};

    if (category) {
      query.category = category;
    }

    if (weather) {
      query.$or = [{ weather }, { weather: 'all' }];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    // Execute query
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Retrieved ${products.length} products`);

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${req.params.id}`
      });
    }

    console.log(`✅ Retrieved product: ${product.name}`);

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Error fetching product:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid product ID',
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
 * @route   PUT /api/products/:id
 * @desc    Update a product by ID
 * @access  Public
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, price, description, category, icon, weather, stock, imageUrl, isActive } = req.body;

    // Find product
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${req.params.id}`
      });
    }

    // Update fields
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (icon !== undefined) product.icon = icon;
    if (weather !== undefined) product.weather = weather;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (isActive !== undefined) product.isActive = isActive;

    // Save updated product
    await product.save();

    console.log(`✅ Product updated: ${product.name} (ID: ${product._id})`);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages
      });
    }

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid product ID',
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
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${req.params.id}`
      });
    }

    const productName = product.name;
    await product.deleteOne();

    console.log(`✅ Product deleted: ${productName} (ID: ${req.params.id})`);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        id: req.params.id,
        name: productName
      }
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Invalid product ID',
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

module.exports = router;