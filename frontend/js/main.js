// Main JavaScript file with utility functions

// Show loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading...</p></div>';
  }
}

// Hide loading spinner
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const loading = element.querySelector('.loading');
    if (loading) {
      loading.remove();
    }
  }
}

// Show error message
function showError(message, elementId = 'error-message') {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.innerHTML = `
      <div class="alert alert-error">
        <span class="alert-icon">⚠️</span>
        <span>${message}</span>
      </div>
    `;
    errorDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// Show success message
function showSuccess(message, elementId = 'success-message') {
  const successDiv = document.getElementById(elementId);
  if (successDiv) {
    successDiv.innerHTML = `
      <div class="alert alert-success">
        <span class="alert-icon">✓</span>
        <span>${message}</span>
      </div>
    `;
    successDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Format time
function formatTime(timeString) {
  return timeString;
}

// Format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// API fetch wrapper
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Get from localStorage
function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

// Save to localStorage
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Remove from localStorage
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone
function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Update active navigation
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
});
