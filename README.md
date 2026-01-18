# ⚡ Tech Weather Store - MongoDB CRUD API

> **Assignment 3: MongoDB Database Integration & Full-Stack CRUD**  
> Evolution from JSON-based storage to MongoDB with comprehensive CRUD operations

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.0-brightgreen.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-v8.0-red.svg)](https://mongoosejs.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [What's New in Assignment 3](#-whats-new-in-assignment-3)
- [Schema Design](#-schema-design)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Testing with Postman](#-testing-with-postman)
- [Frontend Interface](#-frontend-interface)
- [Project Structure](#-project-structure)
- [Assignment Compliance](#-assignment-compliance)

---

## 🌟 Overview

This project represents the evolution of the Tech Weather Store from Assignment 2. We have migrated from a local JSON-based storage system to a robust **MongoDB database** with full CRUD (Create, Read, Update, Delete) functionality.

### Key Features:
✅ **MongoDB Integration** - Complete migration from `data.json` to MongoDB  
✅ **Primary CRUD** - Full CRUD operations for Products  
✅ **Secondary CRUD** - Complete CRUD for Reviews (product reviews)  
✅ **Schema Validation** - Mongoose schemas with comprehensive validation  
✅ **RESTful API** - Industry-standard REST endpoints  
✅ **Full-Stack Interface** - Interactive web UI for product management  
✅ **Relationship Management** - Products ↔ Reviews with automatic rating updates  
✅ **Error Handling** - Proper HTTP status codes and error messages  

---

## 🆕 What's New in Assignment 3

### Migration Changes

| **Before (Assignment 2)** | **After (Assignment 3)** |
|---------------------------|--------------------------|
| JSON file storage (`object.json`) | MongoDB database |
| Simple array manipulation | Mongoose ODM with schemas |
| No data validation | Comprehensive validation rules |
| Basic CRUD | Full RESTful CRUD with relationships |
| No timestamps | Automatic `createdAt` & `updatedAt` |
| No data relationships | Product-Review relationships |
| Limited error handling | Detailed error responses |

### New Features

1. **MongoDB Database**
   - Cloud-ready (MongoDB Atlas)
   - Local development support
   - Connection pooling
   - Automatic reconnection

2. **Advanced Schema Design**
   - Required field validation
   - Custom validators
   - Default values
   - Indexes for performance
   - Virtual fields
   - Pre/post middleware

3. **Enhanced CRUD Operations**
   - Query filtering and sorting
   - Population of related documents
   - Cascading updates
   - Soft deletes option

4. **Full-Stack Interface**
   - Modern, responsive UI
   - Real-time product management
   - Inline editing
   - Instant feedback

---

## 📊 Schema Design

### Primary Object: **Product**

```javascript
{
  // Required Fields
  name: String (3-100 chars, required),
  price: Number (min: 0, required),
  description: String (10-1000 chars, required),
  category: Enum (required),
  
  // Additional Fields
  icon: String (default: '📦'),
  weather: Enum (all, hot, cold, rain),
  stock: Number (min: 0, required),
  imageUrl: String,
  isActive: Boolean (default: true),
  averageRating: Number (0-5),
  totalReviews: Number,
  
  // Automatic Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Validation Rules:**
- ✅ Name must be 3-100 characters
- ✅ Price must be non-negative
- ✅ Description must be 10-1000 characters
- ✅ Category must be valid enum value
- ✅ Stock cannot be negative
- ✅ Rating between 0-5

**Indexes:**
- `{ name: 1, category: 1 }` - Fast name/category lookup
- `{ price: 1 }` - Price range queries
- `{ weather: 1 }` - Weather-based filtering

---

### Secondary Object: **Review**

```javascript
{
  // Required Fields
  title: String (3-100 chars, required),
  rating: Number (1-5, integer, required),
  comment: String (10-500 chars, required),
  product: ObjectId (ref: Product, required),
  reviewerName: String (2-50 chars, required),
  reviewerEmail: String (email format, required),
  
  // Additional Fields
  verified: Boolean (default: false),
  helpful: Number (min: 0),
  isActive: Boolean (default: true),
  
  // Automatic Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Validation Rules:**
- ✅ Rating must be 1-5 (whole number)
- ✅ Email must be valid format
- ✅ Product reference must exist
- ✅ Comment 10-500 characters

**Relationships:**
- Reviews belong to Products (many-to-one)
- Automatic average rating calculation
- Cascading updates on review changes

---

## 💻 Installation & Setup

### Prerequisites
```bash
✅ Node.js v14+ 
✅ npm v6+
✅ MongoDB Atlas account OR local MongoDB
✅ Git
```

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/tech-weather-store.git
cd tech-weather-store

# Install dependencies
npm install
```

### Step 2: MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to Database Access
   - Add New Database User
   - Username: `techstore_admin`
   - Password: Generate secure password
   - User Privileges: Read and write to any database

4. **Whitelist IP Address**
   - Go to Network Access
   - Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0` (for development)

5. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `techweatherstore`

#### Option B: Local MongoDB

```bash
# Install MongoDB locally
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
mongod --dbpath /path/to/data/directory
```

### Step 3: Configure Environment

Create `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techweatherstore?retryWrites=true&w=majority

# OR Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/techweatherstore

# API Keys (from Assignment 2)
OPENWEATHER_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
EXCHANGERATE_API_KEY=your_key_here
```

### Step 4: Seed Database

```bash
# Populate database with initial products
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing products
✅ Successfully seeded 10 products
   - 💻 MacBook Pro 14" ($1999)
   - 📱 iPad Air ($599)
   ...
```

### Step 5: Start Server

```bash
# Production mode
npm start

# Development mode (auto-reload)
npm run dev
```

Expected output:
```
╔═══════════════════════════════════════════════╗
║     🚀 Tech Weather Store API Server         ║
║        Assignment 3 - MongoDB Version        ║
║                                               ║
║     Server: http://localhost:3000            ║
║     Database: MongoDB Atlas                   ║
╚═══════════════════════════════════════════════╝

✅ MongoDB Connected Successfully
   Host: cluster0-xxxxx.mongodb.net
   Database: techweatherstore
```

### Step 6: Access Application

```bash
# Main application
http://localhost:3000

# Product management interface
http://localhost:3000/crud.html

# API health check
http://localhost:3000/api/health
```

---

## 🔗 API Endpoints

### Products CRUD (Primary)

#### **CREATE** Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "AirPods Pro",
  "price": 249,
  "description": "Premium wireless earbuds with active noise cancellation",
  "category": "accessory",
  "icon": "🎧",
  "weather": "all",
  "stock": 100
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "AirPods Pro",
    "price": 249,
    "description": "Premium wireless earbuds...",
    "category": "accessory",
    "icon": "🎧",
    "weather": "all",
    "stock": 100,
    "isActive": true,
    "averageRating": 0,
    "totalReviews": 0,
    "createdAt": "2025-01-18T10:30:00.000Z",
    "updatedAt": "2025-01-18T10:30:00.000Z"
  }
}
```

---

#### **READ** All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` - Filter by category (laptop, phone, tablet, accessory, wearable)
- `weather` - Filter by weather (all, hot, cold, rain)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `active` - Filter active products (true/false)

**Examples:**
```http
GET /api/products?category=laptop
GET /api/products?weather=hot&minPrice=20&maxPrice=100
GET /api/products?active=true
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "MacBook Pro 14\"",
      "price": 1999,
      "category": "laptop",
      ...
    }
  ]
}
```

---

#### **READ** Single Product
```http
GET /api/products/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "MacBook Pro 14\"",
    "price": 1999,
    "reviews": [
      {
        "_id": "65b2c3d4e5f6g7h8i9j0k1l2",
        "title": "Amazing laptop!",
        "rating": 5,
        ...
      }
    ]
  }
}
```

---

#### **UPDATE** Product
```http
PUT /api/products/:id
Content-Type: application/json

{
  "price": 1899,
  "stock": 20
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "MacBook Pro 14\"",
    "price": 1899,
    "stock": 20,
    "updatedAt": "2025-01-18T11:00:00.000Z"
  }
}
```

---

#### **DELETE** Product
```http
DELETE /api/products/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "MacBook Pro 14\""
  }
}
```

---

### Reviews CRUD (Secondary)

#### **CREATE** Review
```http
POST /api/reviews
Content-Type: application/json

{
  "title": "Excellent product!",
  "rating": 5,
  "comment": "This laptop exceeded my expectations. Fast delivery and great quality.",
  "product": "65a1b2c3d4e5f6g7h8i9j0k1",
  "reviewerName": "John Doe",
  "reviewerEmail": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "_id": "65b2c3d4e5f6g7h8i9j0k1l2",
    "title": "Excellent product!",
    "rating": 5,
    ...
  }
}
```

---

#### **READ** All Reviews
```http
GET /api/reviews?product=65a1b2c3d4e5f6g7h8i9j0k1
```

#### **READ** Single Review
```http
GET /api/reviews/:id
```

#### **UPDATE** Review
```http
PUT /api/reviews/:id
Content-Type: application/json

{
  "helpful": 15
}
```

#### **DELETE** Review
```http
DELETE /api/reviews/:id
```

---

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "messages": [
    "Product name is required",
    "Price must be at least 0"
  ]
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Product not found",
  "message": "No product found with ID: 65a1b2c3d4e5f6g7h8i9j0k1"
}
```

#### 500 Server Error
```json
{
  "success": false,
  "error": "Server error",
  "message": "Database connection failed"
}
```

---

## 🧪 Testing with Postman

### Setup Postman Collection

1. **Import Collection**
   - Open Postman
   - Click Import
   - Create new collection: "Tech Weather Store - Assignment 3"

2. **Set Environment Variables**
   ```
   base_url: http://localhost:3000
   product_id: (will be set dynamically)
   ```

### Test Sequence

#### Test 1: Create Product
```
POST {{base_url}}/api/products

Body (JSON):
{
  "name": "Test Product",
  "price": 99.99,
  "description": "This is a test product for Assignment 3",
  "category": "accessory",
  "stock": 50
}

✅ Expected: 201 Created
📋 Save product._id to environment variable
```

#### Test 2: Get All Products
```
GET {{base_url}}/api/products

✅ Expected: 200 OK with array of products
```

#### Test 3: Get Single Product
```
GET {{base_url}}/api/products/{{product_id}}

✅ Expected: 200 OK with product details
```

#### Test 4: Update Product
```
PUT {{base_url}}/api/products/{{product_id}}

Body (JSON):
{
  "price": 89.99,
  "stock": 45
}

✅ Expected: 200 OK with updated product
```

#### Test 5: Create Review
```
POST {{base_url}}/api/reviews

Body (JSON):
{
  "title": "Great product!",
  "rating": 5,
  "comment": "Highly recommend this product for everyone.",
  "product": "{{product_id}}",
  "reviewerName": "Test User",
  "reviewerEmail": "test@example.com"
}

✅ Expected: 201 Created
```

#### Test 6: Delete Product
```
DELETE {{base_url}}/api/products/{{product_id}}

✅ Expected: 200 OK
```

### Screenshots for Submission

Take screenshots of:
1. ✅ POST /api/products (successful creation)
2. ✅ GET /api/products (list all)
3. ✅ PUT /api/products/:id (successful update)
4. ✅ DELETE /api/products/:id (successful deletion)
5. ✅ POST /api/reviews (review creation)
6. ✅ MongoDB Compass showing data

---

## 🎨 Frontend Interface

Access at: `http://localhost:3000/crud.html`

### Features

1. **Product Form**
   - Create new products
   - Edit existing products
   - Real-time validation
   - Clear error messages

2. **Product List**
   - View all products
   - Filter by category/weather
   - Inline edit buttons
   - Delete with confirmation

3. **Responsive Design**
   - Works on desktop, tablet, mobile
   - Modern gradient UI
   - Smooth animations
   - Intuitive controls

### Usage

1. **Create Product:**
   - Fill in all required fields
   - Click "Create Product"
   - Product appears in list

2. **Edit Product:**
   - Click "Edit" on any product
   - Form fills with current data
   - Update fields
   - Click "Update Product"

3. **Delete Product:**
   - Click "Delete" on any product
   - Confirm deletion
   - Product removed from list

---

## 📁 Project Structure

```
tech-weather-store/
│
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   │
│   ├── models/
│   │   ├── Product.js           # Product schema (primary)
│   │   └── Review.js            # Review schema (secondary)
│   │
│   ├── routes/
│   │   ├── products.js          # Product CRUD routes
│   │   ├── reviews.js           # Review CRUD routes
│   │   ├── weather.js           # Weather API (from A2)
│   │   ├── news.js              # News API (from A2)
│   │   └── currency.js          # Currency API (from A2)
│   │
│   ├── seeders/
│   │   └── productSeeder.js     # Database seeder
│   │
│   └── index.js                 # Main server file
│
├── public/
│   ├── index.html               # Main application
│   ├── crud.html                # Product management UI
│   ├── app.js                   # Frontend logic
│   └── style.css                # Styles
│
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## ✅ Assignment Compliance

### Requirement Checklist

#### 1. Topic Selection & Schema Design (10%)
- [x] **Relevant to Final Project:** Tech e-commerce store
- [x] **Title/Name field:** Product.name (required, validated)
- [x] **Two additional required fields:** 
  - Product.price (validated, min: 0)
  - Product.description (validated, 10-1000 chars)
- [x] **Category field:** Product.category (enum validation)
- [x] **Timestamps:** createdAt, updatedAt (automatic)
- [x] **Additional fields:** stock, weather, icon, etc.

#### 2. Setup and Initialization
- [x] **MongoDB integration:** Using Mongoose ODM
- [x] **Database choice:** MongoDB Atlas (cloud) + local support
- [x] **Migration from JSON:** Completely replaced object.json
- [x] **Validation:** Comprehensive Mongoose validation

#### 3. Core CRUD Functionality (30%)

**Products (Primary):**
- [x] POST /api/products - Create ✅
- [x] GET /api/products - Read all ✅
- [x] GET /api/products/:id - Read one ✅
- [x] PUT /api/products/:id - Update ✅
- [x] DELETE /api/products/:id - Delete ✅

**Reviews (Secondary):**
- [x] POST /api/reviews - Create ✅
- [x] GET /api/reviews - Read all ✅
- [x] GET /api/reviews/:id - Read one ✅
- [x] PUT /api/reviews/:id - Update ✅
- [x] DELETE /api/reviews/:id - Delete ✅

#### 4. Error Handling & Testing
- [x] **Proper status codes:**
  - 200 OK (successful read/update/delete)
  - 201 Created (successful creation)
  - 400 Bad Request (validation errors)
  - 404 Not Found (resource not found)
  - 500 Server Error (unexpected errors)
- [x] **Postman testing:** All endpoints tested
- [x] **Error messages:** Detailed and helpful

#### 5. Full-Stack Interface
- [x] **Frontend UI:** crud.html
- [x] **View list:** Products grid display
- [x] **Submit new data:** Create product form
- [x] **Interactive:** Edit and delete functionality

#### 6. Code Organization (10%)
- [x] **Clean structure:** Organized by concerns
- [x] **Middleware usage:** Express middleware
- [x] **MongoDB methods:** Proper Mongoose operations
- [x] **Comments:** Well-documented code

### Grading Breakdown

| Criteria | Weight | Status |
|----------|--------|--------|
| Core Functionality | 30% | ✅ Complete |
| Topic & Schema Design | 10% | ✅ Complete |
| Code Organization | 10% | ✅ Complete |
| Defense | 50% | 📝 Prepared |

---

## 🎯 Defense Preparation

### Key Topics to Explain

1. **Why MongoDB over JSON?**
   - Scalability and performance
   - Built-in validation
   - Relationship management
   - Query capabilities
   - ACID compliance

2. **Schema Design Decisions:**
   - Required fields rationale
   - Validation rules purpose
   - Index strategy
   - Relationship design

3. **Code Structure:**
   - MVC pattern adaptation
   - Route organization
   - Error handling approach
   - Middleware usage

4. **Final Project Integration:**
   - How this serves the final project
   - Future enhancements planned
   - Scalability considerations

---

## 🚀 Next Steps

1. **Complete Assignment 3:**
   - ✅ Test all CRUD operations
   - ✅ Take Postman screenshots
   - ✅ Prepare defense answers

2. **For Final Project:**
   - Add user authentication
   - Implement order management
   - Create admin dashboard
   - Add payment integration

---

## 👨‍💻 Author

**Dosmagambetov Rakhat**
- Assignment: 3 - MongoDB CRUD API
- Date: January 2025

---

## 📄 License

MIT License - Educational Project

---

<div align="center">

**Assignment 3 - MongoDB Integration Complete! 🎉**

Made with ❤️ for Web Technologies Course

</div>
