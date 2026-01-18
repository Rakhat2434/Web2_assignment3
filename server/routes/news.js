// server/routes/news.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * GET /api/news
 * Fetches latest technology news articles
 * Query params: category, country, pageSize
 */
router.get('/', async (req, res) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const { 
      category = 'technology', 
      country = 'us',
      pageSize = 10
    } = req.query;

    // Fetch news from NewsAPI
    const response = await axios.get(
      'https://newsapi.org/v2/top-headlines',
      {
        params: {
          apiKey: API_KEY,
          category: category,
          country: country,
          pageSize: parseInt(pageSize)
        }
      }
    );

    // Process articles data
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      image: article.urlToImage,
      author: article.author
    }));

    console.log(`✅ News fetched: ${articles.length} articles`);

    res.json({
      success: true,
      data: articles,
      totalResults: response.data.totalResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ News API Error:', error.message);

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid API key',
          message: 'Please check your NewsAPI key'
        });
      } else if (status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      message: error.response?.data?.message || error.message
    });
  }
});

/**
 * GET /api/news/search
 * Search for specific news articles
 * Query params: q (search query), language
 */
router.get('/search', async (req, res) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const { q, language = 'en', pageSize = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const response = await axios.get(
      'https://newsapi.org/v2/everything',
      {
        params: {
          apiKey: API_KEY,
          q: q,
          language: language,
          pageSize: parseInt(pageSize),
          sortBy: 'publishedAt'
        }
      }
    );

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      image: article.urlToImage
    }));

    res.json({
      success: true,
      data: articles,
      totalResults: response.data.totalResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ News Search Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search news',
      message: error.message
    });
  }
});

module.exports = router;