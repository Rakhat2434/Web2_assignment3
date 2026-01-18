// server/seeders/productSeeder.js

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});

const mongoose = require('mongoose');

// Регистрируем модель
require('../models/Product');

// Получаем модель из mongoose
const Product = mongoose.model('Product');

const products = [
  {
    name: 'MacBook Pro 14"',
    price: 1999,
    description: 'Powerful laptop with M3 chip, 14-inch Liquid Retina XDR display, and exceptional battery life. Perfect for professionals and creators.',
    category: 'laptop',
    icon: '💻',
    weather: 'all',
    stock: 15,
    imageUrl: null
  },
  {
    name: 'iPad Air',
    price: 599,
    description: 'Versatile tablet with M1 chip, 10.9-inch display, and Apple Pencil support. Great for work and entertainment.',
    category: 'tablet',
    icon: '📱',
    weather: 'all',
    stock: 30,
    imageUrl: null
  },
  {
    name: 'iPhone 15 Pro',
    price: 999,
    description: 'Latest flagship phone with A17 Pro chip, advanced camera system, and titanium design.',
    category: 'phone',
    icon: '📱',
    weather: 'all',
    stock: 25,
    imageUrl: null
  },
  {
    name: 'Portable USB Fan',
    price: 29,
    description: 'Compact rechargeable fan with three speed settings. Perfect for hot weather and outdoor activities.',
    category: 'accessory',
    icon: '🌀',
    weather: 'hot',
    stock: 50,
    imageUrl: null
  },
  {
    name: 'Wireless Noise-Cancelling Headphones',
    price: 199,
    description: 'Premium headphones with active noise cancellation, 30-hour battery life. Ideal for cold weather commutes.',
    category: 'accessory',
    icon: '🎧',
    weather: 'cold',
    stock: 40,
    imageUrl: null
  },
  {
    name: 'Waterproof Phone Case',
    price: 39,
    description: 'IP68 rated waterproof case that protects your phone from rain and water.',
    category: 'accessory',
    icon: '🛡️',
    weather: 'rain',
    stock: 60,
    imageUrl: null
  },
  {
    name: 'Power Bank 20000mAh',
    price: 49,
    description: 'High-capacity portable charger with fast charging support.',
    category: 'accessory',
    icon: '🔋',
    weather: 'all',
    stock: 45,
    imageUrl: null
  },
  {
    name: 'Apple Watch Series 9',
    price: 399,
    description: 'Advanced smartwatch with fitness tracking and health monitoring.',
    category: 'wearable',
    icon: '⌚',
    weather: 'all',
    stock: 20,
    imageUrl: null
  },
  {
    name: 'Gaming Laptop ROG',
    price: 1499,
    description: 'High-performance gaming laptop with RTX 4070, 16GB RAM, and 144Hz display.',
    category: 'laptop',
    icon: '🎮',
    weather: 'all',
    stock: 12,
    imageUrl: null
  },
  {
    name: 'Wireless Mouse MX Master',
    price: 49,
    description: 'Ergonomic wireless mouse with multi-device support.',
    category: 'accessory',
    icon: '🖱️',
    weather: 'all',
    stock: 80,
    imageUrl: null
  }
];

const seedProducts = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑 Products cleared');

    const created = await Product.insertMany(products);
    console.log(`✅ Seeded ${created.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

seedProducts();
