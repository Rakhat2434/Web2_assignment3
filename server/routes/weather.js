// server/routes/weather.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * GET /api/weather/:city
 * Fetches weather data for a specific city
 * Params: city (city name)
 */
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // Validate input
    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'City name is required'
      });
    }

    // Fetch weather data from OpenWeather API
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric' // Use Celsius
        }
      }
    );

    


    const data = response.data;

    // Process and structure the response with all required fields
    const weatherData = {
      temperature: data.main.temp,
      description: data.weather[0].description,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      feelsLike: data.main.feels_like,
      windSpeed: data.wind.speed,
      countryCode: data.sys.country,
      rain: data.rain ? data.rain['3h'] || 0 : 0, // Rain volume for last 3 hours
      // Additional useful data
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      icon: data.weather[0].icon,
      cityName: data.name
    };

    console.log(`✅ Weather data fetched successfully for ${city}`);
    
    res.json({
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Weather API Error:', error.message);
    
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({
          success: false,
          error: 'City not found',
          message: 'Please check the city name and try again'
        });
      } else if (status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid API key',
          message: 'Please check your OpenWeather API key'
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data',
      message: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;