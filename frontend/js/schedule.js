// Train Schedule Page JavaScript

let allTrains = [];

// Load trains on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTrains();
  setupSearchForm();
});

// Load all trains
async function loadTrains() {
  try {
    showLoading('trains-container');
    const response = await apiFetch('/trains');
    allTrains = response.data;
    displayTrains(allTrains);
  } catch (error) {
    showError('Failed to load trains: ' + error.message, 'trains-container');
  }
}

// Display trains
function displayTrains(trains) {
  const container = document.getElementById('trains-container');
  
  if (!trains || trains.length === 0) {
    container.innerHTML = '<div class="no-results"><p>No trains found</p></div>';
    return;
  }
  
  container.innerHTML = trains.map(train => `
    <div class="train-card">
      <div class="train-header">
        <div class="train-info">
          <h3>${train.trainName}</h3>
          <p class="train-number">${train.trainNumber}</p>
        </div>
        <div class="train-status ${train.status.toLowerCase().replace(' ', '-')}">
          ${train.status}
        </div>
      </div>
      
      <div class="train-route">
        <div class="route-point">
          <div class="station-name">${train.origin}</div>
          <div class="time">${train.departureTime}</div>
        </div>
        <div class="route-line">
          <div class="duration">${train.duration}</div>
        </div>
        <div class="route-point">
          <div class="station-name">${train.destination}</div>
          <div class="time">${train.arrivalTime}</div>
        </div>
      </div>
      
      <div class="train-details">
        <div class="detail-item">
          <span class="label">Price:</span>
          <span class="value price">${formatCurrency(train.price)}</span>
        </div>
        <div class="detail-item">
          <span class="label">Available Seats:</span>
          <span class="value seats">${train.availableSeats}/${train.totalSeats}</span>
        </div>
        <div class="detail-item">
          <span class="label">Days:</span>
          <span class="value">${train.days.join(', ')}</span>
        </div>
      </div>
      
      <div class="train-actions">
        <button class="btn btn-primary" onclick="bookTrain('${train.id}')">
          Book Now
        </button>
        <button class="btn btn-secondary" onclick="viewTrainDetails('${train.id}')">
          View Details
        </button>
      </div>
    </div>
  `).join('');
}

// Setup search form
function setupSearchForm() {
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      searchTrains();
    });
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-search');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('search-form').reset();
      displayTrains(allTrains);
    });
  }
}

// Search trains
async function searchTrains() {
  const origin = document.getElementById('origin').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const date = document.getElementById('date').value;
  
  if (!origin && !destination) {
    displayTrains(allTrains);
    return;
  }
  
  try {
    showLoading('trains-container');
    const queryParams = new URLSearchParams();
    if (origin) queryParams.append('origin', origin);
    if (destination) queryParams.append('destination', destination);
    if (date) queryParams.append('date', date);
    
    const response = await apiFetch(`/trains/search?${queryParams.toString()}`);
    displayTrains(response.data);
  } catch (error) {
    showError('Failed to search trains: ' + error.message, 'trains-container');
  }
}

// Book train
function bookTrain(trainId) {
  const train = allTrains.find(t => t.id === trainId);
  if (train) {
    saveToStorage('selectedTrain', train);
    window.location.href = 'booking.html';
  }
}

// View train details
function viewTrainDetails(trainId) {
  const train = allTrains.find(t => t.id === trainId);
  if (train) {
    alert(`
Train Details:
--------------
Train: ${train.trainName} (${train.trainNumber})
Route: ${train.origin} → ${train.destination}
Departure: ${train.departureTime}
Arrival: ${train.arrivalTime}
Duration: ${train.duration}
Price: ${formatCurrency(train.price)}
Available Seats: ${train.availableSeats}/${train.totalSeats}
Status: ${train.status}
Operating Days: ${train.days.join(', ')}
    `);
  }
}
