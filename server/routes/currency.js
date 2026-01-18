// server/routes/currency.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * GET /api/currency/:from/:to
 * Fetches exchange rate between two currencies
 * Params: from (source currency), to (target currency)
 */
router.get('/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const API_KEY = process.env.EXCHANGERATE_API_KEY;

    // Validate currency codes
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Both source and target currency codes are required'
      });
    }

    // Convert to uppercase
    const fromCurrency = from.toUpperCase();
    const toCurrency = to.toUpperCase();

    // Fetch exchange rate from ExchangeRate-API
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`
    );

    const data = response.data;

    // Check if request was successful
    if (data.result !== 'success') {
      return res.status(400).json({
        success: false,
        error: 'Invalid currency code',
        message: data['error-type'] || 'Invalid currency pair'
      });
    }

    // Structure the response
    const currencyData = {
      from: fromCurrency,
      to: toCurrency,
      rate: data.conversion_rate,
      lastUpdate: data.time_last_update_utc,
      nextUpdate: data.time_next_update_utc
    };

    console.log(`✅ Currency rate fetched: ${fromCurrency} to ${toCurrency} = ${currencyData.rate}`);

    res.json({
      success: true,
      data: currencyData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Currency API Error:', error.message);

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      if (status === 403) {
        return res.status(403).json({
          success: false,
          error: 'Invalid API key',
          message: 'Please check your ExchangeRate API key'
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch currency rate',
      message: error.response?.data?.message || error.message
    });
  }
});

/**
 * GET /api/currency/rates/:base
 * Get all exchange rates for a base currency
 */
router.get('/rates/:base', async (req, res) => {
  try {
    const { base } = req.params;
    const API_KEY = process.env.EXCHANGERATE_API_KEY;

    const baseCurrency = base.toUpperCase();

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
    );

    const data = response.data;

    if (data.result !== 'success') {
      return res.status(400).json({
        success: false,
        error: 'Invalid currency code'
      });
    }

    res.json({
      success: true,
      data: {
        base: baseCurrency,
        rates: data.conversion_rates,
        lastUpdate: data.time_last_update_utc
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Currency Rates Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch currency rates',
      message: error.message
    });
  }
});

module.exports = router;