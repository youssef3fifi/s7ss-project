// API Configuration
// For local development, use localhost
// For EC2 deployment, update this to your EC2 public IP address
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : `http://${window.location.hostname}:3000/api`;

// You can also set a specific backend URL here for EC2 deployment
// Example: const API_BASE_URL = 'http://54.123.45.67:3000/api';

console.log('API Base URL:', API_BASE_URL);
