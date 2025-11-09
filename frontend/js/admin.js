// Admin Dashboard JavaScript

let trains = [];
let bookings = [];
let stations = [];

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
  setupTabs();
  setupForms();
});

// Load all dashboard data
async function loadDashboardData() {
  try {
    await Promise.all([
      loadTrains(),
      loadBookings(),
      loadStations()
    ]);
    updateStats();
  } catch (error) {
    showError('Failed to load dashboard data: ' + error.message);
  }
}

// Load trains
async function loadTrains() {
  try {
    const response = await apiFetch('/trains');
    trains = response.data;
    displayTrainsTable(trains);
  } catch (error) {
    console.error('Failed to load trains:', error);
  }
}

// Load bookings
async function loadBookings() {
  try {
    const response = await apiFetch('/bookings');
    bookings = response.data;
    displayBookingsTable(bookings);
  } catch (error) {
    console.error('Failed to load bookings:', error);
  }
}

// Load stations
async function loadStations() {
  try {
    const response = await apiFetch('/stations');
    stations = response.data;
    displayStationsTable(stations);
  } catch (error) {
    console.error('Failed to load stations:', error);
  }
}

// Update statistics
function updateStats() {
  document.getElementById('total-trains').textContent = trains.length;
  document.getElementById('total-bookings').textContent = bookings.length;
  document.getElementById('total-stations').textContent = stations.length;
  
  const totalRevenue = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
}

// Display trains table
function displayTrainsTable(trainsData) {
  const tbody = document.getElementById('trains-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = trainsData.map(train => `
    <tr>
      <td>${train.trainNumber}</td>
      <td>${train.trainName}</td>
      <td>${train.origin}</td>
      <td>${train.destination}</td>
      <td>${train.departureTime}</td>
      <td>${formatCurrency(train.price)}</td>
      <td>${train.availableSeats}/${train.totalSeats}</td>
      <td>
        <button class="btn-small btn-edit" onclick="editTrain('${train.id}')">Edit</button>
        <button class="btn-small btn-delete" onclick="deleteTrain('${train.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Display bookings table
function displayBookingsTable(bookingsData) {
  const tbody = document.getElementById('bookings-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = bookingsData.map(booking => `
    <tr>
      <td>${booking.bookingReference}</td>
      <td>${booking.passengerName}</td>
      <td>${booking.trainName}</td>
      <td>${formatDate(booking.travelDate)}</td>
      <td>${booking.numberOfSeats}</td>
      <td>${formatCurrency(booking.totalPrice)}</td>
      <td><span class="status-badge status-${booking.status.toLowerCase()}">${booking.status}</span></td>
      <td>
        ${booking.status !== 'Cancelled' ? `
          <button class="btn-small btn-cancel" onclick="cancelBooking('${booking.id}')">Cancel</button>
        ` : ''}
        <button class="btn-small btn-delete" onclick="deleteBooking('${booking.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Display stations table
function displayStationsTable(stationsData) {
  const tbody = document.getElementById('stations-table-body');
  if (!tbody) return;
  
  tbody.innerHTML = stationsData.map(station => `
    <tr>
      <td>${station.name}</td>
      <td>${station.code}</td>
      <td>${station.city}</td>
      <td>${station.platforms}</td>
      <td>${station.facilities.join(', ')}</td>
      <td>
        <button class="btn-small btn-edit" onclick="editStation('${station.id}')">Edit</button>
        <button class="btn-small btn-delete" onclick="deleteStation('${station.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Setup tabs
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding panel
      tab.classList.add('active');
      const panelId = tab.getAttribute('data-tab');
      document.getElementById(panelId).classList.add('active');
    });
  });
}

// Setup forms
function setupForms() {
  // Add train form
  const addTrainForm = document.getElementById('add-train-form');
  if (addTrainForm) {
    addTrainForm.addEventListener('submit', handleAddTrain);
  }
  
  // Add station form
  const addStationForm = document.getElementById('add-station-form');
  if (addStationForm) {
    addStationForm.addEventListener('submit', handleAddStation);
  }
}

// Handle add train
async function handleAddTrain(e) {
  e.preventDefault();
  
  const formData = {
    trainNumber: document.getElementById('train-number').value,
    trainName: document.getElementById('train-name').value,
    origin: document.getElementById('train-origin').value,
    destination: document.getElementById('train-destination').value,
    departureTime: document.getElementById('departure-time').value,
    arrivalTime: document.getElementById('arrival-time').value,
    duration: document.getElementById('duration').value,
    price: parseFloat(document.getElementById('price').value),
    totalSeats: parseInt(document.getElementById('total-seats').value),
    days: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value)
  };
  
  try {
    const response = await apiFetch('/trains', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (response.success) {
      showSuccess('Train added successfully!');
      e.target.reset();
      await loadTrains();
      updateStats();
    }
  } catch (error) {
    showError('Failed to add train: ' + error.message);
  }
}

// Handle add station
async function handleAddStation(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('station-name').value,
    code: document.getElementById('station-code').value,
    city: document.getElementById('station-city').value,
    address: document.getElementById('station-address').value,
    platforms: parseInt(document.getElementById('platforms').value),
    contactNumber: document.getElementById('contact-number').value,
    facilities: document.getElementById('facilities').value.split(',').map(f => f.trim())
  };
  
  try {
    const response = await apiFetch('/stations', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (response.success) {
      showSuccess('Station added successfully!');
      e.target.reset();
      await loadStations();
      updateStats();
    }
  } catch (error) {
    showError('Failed to add station: ' + error.message);
  }
}

// Edit train
function editTrain(id) {
  const train = trains.find(t => t.id === id);
  if (train) {
    // Fill form with train data
    document.getElementById('train-number').value = train.trainNumber;
    document.getElementById('train-name').value = train.trainName;
    document.getElementById('train-origin').value = train.origin;
    document.getElementById('train-destination').value = train.destination;
    document.getElementById('departure-time').value = train.departureTime;
    document.getElementById('arrival-time').value = train.arrivalTime;
    document.getElementById('duration').value = train.duration;
    document.getElementById('price').value = train.price;
    document.getElementById('total-seats').value = train.totalSeats;
    
    // Scroll to form
    document.getElementById('add-train-form').scrollIntoView({ behavior: 'smooth' });
  }
}

// Delete train
async function deleteTrain(id) {
  if (!confirm('Are you sure you want to delete this train?')) return;
  
  try {
    const response = await apiFetch(`/trains/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      showSuccess('Train deleted successfully!');
      await loadTrains();
      updateStats();
    }
  } catch (error) {
    showError('Failed to delete train: ' + error.message);
  }
}

// Cancel booking
async function cancelBooking(id) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  
  try {
    const response = await apiFetch(`/bookings/${id}/cancel`, {
      method: 'PATCH'
    });
    
    if (response.success) {
      showSuccess('Booking cancelled successfully!');
      await loadBookings();
      await loadTrains(); // Refresh to update available seats
      updateStats();
    }
  } catch (error) {
    showError('Failed to cancel booking: ' + error.message);
  }
}

// Delete booking
async function deleteBooking(id) {
  if (!confirm('Are you sure you want to delete this booking?')) return;
  
  try {
    const response = await apiFetch(`/bookings/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      showSuccess('Booking deleted successfully!');
      await loadBookings();
      updateStats();
    }
  } catch (error) {
    showError('Failed to delete booking: ' + error.message);
  }
}

// Edit station
function editStation(id) {
  const station = stations.find(s => s.id === id);
  if (station) {
    document.getElementById('station-name').value = station.name;
    document.getElementById('station-code').value = station.code;
    document.getElementById('station-city').value = station.city;
    document.getElementById('station-address').value = station.address;
    document.getElementById('platforms').value = station.platforms;
    document.getElementById('contact-number').value = station.contactNumber;
    document.getElementById('facilities').value = station.facilities.join(', ');
    
    document.getElementById('add-station-form').scrollIntoView({ behavior: 'smooth' });
  }
}

// Delete station
async function deleteStation(id) {
  if (!confirm('Are you sure you want to delete this station?')) return;
  
  try {
    const response = await apiFetch(`/stations/${id}`, {
      method: 'DELETE'
    });
    
    if (response.success) {
      showSuccess('Station deleted successfully!');
      await loadStations();
      updateStats();
    }
  } catch (error) {
    showError('Failed to delete station: ' + error.message);
  }
}
