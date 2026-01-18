// server/models/Product.js
const mongoose = require('mongoose');

/**
 * Product Schema - Primary Object
 * Represents tech products in the weather store
 */
const productSchema = new mongoose.Schema(
  {
    // Required: Title/Name
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },

    // Required: Price
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: function(value) {
          return value >= 0 && Number.isFinite(value);
        },
        message: 'Price must be a valid positive number'
      }
    },

    // Required: Description
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    // Additional fields
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: ['laptop', 'phone', 'tablet', 'accessory', 'wearable', 'other'],
        message: '{VALUE} is not a valid category'
      }
    },

    icon: {
      type: String,
      default: '📦',
      trim: true
    },

    weather: {
      type: String,
      enum: ['all', 'hot', 'cold', 'rain'],
      default: 'all',
      required: true
    },

    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },

    imageUrl: {
      type: String,
      trim: true,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// Index for faster queries
productSchema.index({ name: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ weather: 1 });

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Convert name to title case
  if (this.isModified('name')) {
    this.name = this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  next();
});

// Instance method to check if product is available
productSchema.methods.isAvailable = function() {
  return this.isActive && this.stock > 0;
};

// Static method to find by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

// Static method to find by weather condition
productSchema.statics.findByWeather = function(weather) {
  return this.find({ 
    $or: [{ weather }, { weather: 'all' }],
    isActive: true 
  });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

