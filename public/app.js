// public/app.js

// ===================================
// CONFIGURATION
// ===================================
const API_BASE = '/api';
let currentCurrency = { 
    rate: 1, 
    symbol: '$',
    code: 'USD'
};

// Mock products data
let products = [
    { id: 1, name: 'MacBook Pro 14"', price: 1999, category: 'laptop', icon: '💻', weather: 'all' },
    { id: 2, name: 'iPad Air', price: 599, category: 'tablet', icon: '📱', weather: 'all' },
    { id: 3, name: 'iPhone 15 Pro', price: 999, category: 'phone', icon: '📱', weather: 'all' },
    { id: 4, name: 'Portable Fan', price: 29, category: 'accessory', icon: '🌀', weather: 'all' },
    { id: 5, name: 'Wireless Headphones', price: 199, category: 'accessory', icon: '🎧', weather: 'all' },
    { id: 6, name: 'Waterproof Case', price: 39, category: 'accessory', icon: '🛡️', weather: 'all' },
    { id: 7, name: 'Power Bank 20000mAh', price: 49, category: 'accessory', icon: '🔋', weather: 'all' },
    { id: 8, name: 'Smart Watch', price: 399, category: 'wearable', icon: '⌚', weather: 'all' },
    { id: 9, name: 'Gaming Laptop', price: 1499, category: 'laptop', icon: '🎮', weather: 'all' },
    { id: 10, name: 'Wireless Mouse', price: 49, category: 'accessory', icon: '🖱️', weather: 'all' }
];

// ===================================
// MAIN FUNCTIONS
// ===================================

/**
 * Fetch all data for a city
 */
async function fetchData() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading(true);
    hideError();

    try {
        // Fetch weather data
        const weatherData = await fetchWeather(city);
        displayWeather(weatherData);

        // Fetch currency based on country
        const currencyCode = getCurrencyByCountry(weatherData.countryCode);
        if (currencyCode !== 'USD') {
            const currencyData = await fetchCurrency('USD', currencyCode);
            currentCurrency = {
                rate: currencyData.rate,
                symbol: getCurrencySymbol(currencyCode),
                code: currencyCode
            };
        } else {
            currentCurrency = { rate: 1, symbol: '$', code: 'USD' };
        }

        // Display products based on weather
        displayProducts(weatherData);

        // Fetch and display news
        const newsData = await fetchNews();
        displayNews(newsData);

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}


/**
 * Fetch weather data from API
 */
async function fetchWeather(city) {
    try {
        const response = await fetch(`${API_BASE}/weather/${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }

        return data.data;
    } catch (error) {
        throw new Error(`Weather API Error: ${error.message}`);
    }
}

/**
 * Fetch news data from API
 */
async function fetchNews() {
    try {
        const response = await fetch(`${API_BASE}/news?category=technology&pageSize=5`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch news');
        }

        return data.data;
    } catch (error) {
        console.error('News API Error:', error);
        return []; // Return empty array if news fails
    }
}

/**
 * Fetch currency exchange rate
 */
async function fetchCurrency(from, to) {
    try {
        const response = await fetch(`${API_BASE}/currency/${from}/${to}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch currency rate');
        }

        return data.data;
    } catch (error) {
        console.error('Currency API Error:', error);
        return { rate: 1 }; // Default to 1:1 if fails
    }
}

// ===================================
// DISPLAY FUNCTIONS
// ===================================

/**
 * Display weather data
 */
function displayWeather(weather) {
    const section = document.getElementById('weatherSection');
    const grid = document.getElementById('weatherGrid');

    grid.innerHTML = `
        <div class="weather-card">
            <h3>🌡️ Temperature</h3>
            <div class="value">${weather.temperature.toFixed(1)}°C</div>
            <div class="subtitle">${weather.description}</div>
        </div>
        <div class="weather-card">
            <h3>🤔 Feels Like</h3>
            <div class="value">${weather.feelsLike.toFixed(1)}°C</div>
            <div class="subtitle">Wind: ${weather.windSpeed} m/s</div>
        </div>
        <div class="weather-card">
            <h3>📍 Location</h3>
            <div class="value">${weather.countryCode}</div>
            <div class="subtitle">Lat: ${weather.coordinates.lat.toFixed(2)}, Lon: ${weather.coordinates.lon.toFixed(2)}</div>
        </div>
        <div class="weather-card">
            <h3>💧 Rain (3h)</h3>
            <div class="value">${weather.rain} mm</div>
            <div class="subtitle">${weather.rain > 0 ? 'Rainy conditions' : 'No rain'}</div>
        </div>
    `;

    section.classList.remove('hidden');
}

/**
 * Display products based on weather
 */
function displayProducts(weather) {
    const section = document.getElementById('productsSection');
    const grid = document.getElementById('productsGrid');

    // Filter products based on weather
    let recommended = products.filter(p => p.weather === 'all');
    
    if (weather.temperature > 30) {
        recommended = [...recommended, ...products.filter(p => p.weather === 'hot')];
    } else if (weather.temperature < 10) {
        recommended = [...recommended, ...products.filter(p => p.weather === 'cold')];
    }
    
    if (weather.rain > 0) {
        recommended = [...recommended, ...products.filter(p => p.weather === 'rain')];
    }

    // Remove duplicates and limit to 6 products
    const uniqueProducts = [...new Map(recommended.map(p => [p.id, p])).values()].slice(0, 6);

    grid.innerHTML = uniqueProducts.map(product => {
        const localPrice = (product.price * currentCurrency.rate).toFixed(0);
        const isRecommended = product.weather !== 'all';

        return `
            <div class="product-card">
                ${isRecommended ? '<div class="recommendation-badge">⭐ Recommended for Current Weather</div>' : ''}
                <div class="product-icon">${product.icon}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-price-local">≈ ${localPrice} ${currentCurrency.symbol}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    🛒 Add to Cart
                </button>
            </div>
        `;
    }).join('');

    section.classList.remove('hidden');
}

/**
 * Display news articles
 */
function displayNews(articles) {
    const section = document.getElementById('newsSection');
    const grid = document.getElementById('newsGrid');

    if (!articles || articles.length === 0) {
        section.classList.add('hidden');
        return;
    }

    grid.innerHTML = articles.map(article => {
        const date = new Date(article.publishedAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return `
            <div class="news-item" onclick="openNews('${article.url}')">
                <div class="news-title">${escapeHtml(article.title)}</div>
                <div class="news-meta">
                    <span class="news-source">${escapeHtml(article.source)}</span>
                    <span>•</span>
                    <span>${formattedDate}</span>
                </div>
            </div>
        `;
    }).join('');

    section.classList.remove('hidden');
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Get currency code by country code
 */
function getCurrencyByCountry(countryCode) {
    const currencyMap = {
        'US': 'USD', 'GB': 'GBP', 'KZ': 'KZT', 'RU': 'RUB',
        'CN': 'CNY', 'JP': 'JPY', 'IN': 'INR', 'CA': 'CAD',
        'AU': 'AUD', 'EU': 'EUR', 'DE': 'EUR', 'FR': 'EUR',
        'IT': 'EUR', 'ES': 'EUR', 'BR': 'BRL', 'MX': 'MXN',
        'KR': 'KRW', 'TR': 'TRY', 'PL': 'PLN', 'SE': 'SEK',
        'NO': 'NOK', 'DK': 'DKK', 'CH': 'CHF', 'NZ': 'NZD'
    };
    
    return currencyMap[countryCode] || 'USD';
}

/**
 * Get currency symbol by code
 */
function getCurrencySymbol(code) {
    const symbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'KZT': '₸',
        'RUB': '₽', 'CNY': '¥', 'JPY': '¥', 'INR': '₹',
        'CAD': 'C$', 'AUD': 'A$', 'BRL': 'R$', 'MXN': 'Mex$',
        'KRW': '₩', 'TRY': '₺', 'PLN': 'zł', 'SEK': 'kr',
        'NOK': 'kr', 'DKK': 'kr', 'CHF': 'Fr', 'NZD': 'NZ$'
    };
    
    return symbols[code] || code;
}



/**
 * Open news article in new tab
 */
function openNews(url) {
    window.open(url, '_blank');
}

/**
 * Show loading indicator
 */
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.innerHTML = `
            <div class="spinner"></div>
            <p>Loading data...</p>
        `;
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = `❌ Error: ${message}`;
    errorDiv.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    const errorDiv = document.getElementById('error');
    errorDiv.classList.add('hidden');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Handle Enter key press in search input
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        fetchData();
    }
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Tech Weather Store initialized');
    
    // Add event listener to search input
    const cityInput = document.getElementById('cityInput');
    if (cityInput) {
        cityInput.addEventListener('keypress', handleKeyPress);
    }
    
    // Load default city
    fetchData();
});

// ===================================
// EXPORT FUNCTIONS (for testing)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWeather,
        fetchNews,
        fetchCurrency,
        getCurrencyByCountry,
        getCurrencySymbol
    };
}
// ===================================
// SHOPPING CART FUNCTIONALITY
// ===================================

let cart = [];

/**
 * Toggle cart modal visibility
 */
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        displayCart();
    }
}

/**
 * Add product to cart 
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification(`✅ ${product.name} added to cart!`);
}

/**
 * Remove product from cart
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCart();
    showNotification('🗑️ Item removed from cart');
}

/**
 * Update product quantity in cart
 */
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        displayCart();
        updateCartCount();
    }
}

/**
 * Clear entire cart
 */
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartCount();
        displayCart();
        showNotification('🗑️ Cart cleared');
    }
}

/**
 * Update cart count badge
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

/**
 * Display cart items
 */
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        updateCartTotal();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const localPrice = (item.price * currentCurrency.rate).toFixed(0);
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const itemTotalLocal = (item.price * item.quantity * currentCurrency.rate).toFixed(0);

        return `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">
                        $${item.price} × ${item.quantity} = $${itemTotal}
                        <br>
                        <small>≈ ${localPrice} ${currentCurrency.symbol} each</small>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    🗑️
                </button>
            </div>
        `;
    }).join('');

    updateCartTotal();
}

/**
 * Update cart total
 */
function updateCartTotal() {
    const totalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalLocal = totalUSD * currentCurrency.rate;

    document.getElementById('totalUSD').textContent = `$${totalUSD.toFixed(2)}`;
    document.getElementById('totalLocal').textContent = `≈ ${totalLocal.toFixed(0)} ${currentCurrency.symbol}`;
}

/**
 * Checkout
 */
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const totalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalLocal = (totalUSD * currentCurrency.rate).toFixed(0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const message = `
🎉 Order Summary:

Items: ${itemCount}
Total: $${totalUSD.toFixed(2)} (≈ ${totalLocal} ${currentCurrency.symbol})

Thank you for shopping with Tech Weather Store!
    `;

    alert(message);
    cart = [];
    updateCartCount();
    displayCart();
    toggleCart();
    showNotification('✅ Order placed successfully!');
}

/**
 * Show notification
 */
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);