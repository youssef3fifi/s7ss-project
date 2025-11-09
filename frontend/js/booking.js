// Booking Page JavaScript

let selectedTrain = null;
let userBookings = [];

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSelectedTrain();
  setupBookingForm();
  loadUserBookings();
});

// Load selected train
function loadSelectedTrain() {
  selectedTrain = getFromStorage('selectedTrain');
  
  if (selectedTrain) {
    displayTrainInfo(selectedTrain);
  } else {
    // Show train selection if no train is selected
    loadAvailableTrains();
  }
}

// Display train info
function displayTrainInfo(train) {
  const container = document.getElementById('selected-train-info');
  if (container) {
    container.innerHTML = `
      <div class="selected-train">
        <h3>${train.trainName} (${train.trainNumber})</h3>
        <div class="train-route-simple">
          <span>${train.origin}</span>
          <span class="arrow">→</span>
          <span>${train.destination}</span>
        </div>
        <div class="train-time">
          ${train.departureTime} - ${train.arrivalTime} (${train.duration})
        </div>
        <div class="train-price">
          Price per seat: <strong>${formatCurrency(train.price)}</strong>
        </div>
        <div class="available-seats">
          Available seats: <strong>${train.availableSeats}/${train.totalSeats}</strong>
        </div>
      </div>
    `;
  }
}

// Load available trains for selection
async function loadAvailableTrains() {
  const select = document.getElementById('train-select');
  if (!select) return;
  
  try {
    const response = await apiFetch('/trains');
    const trains = response.data;
    
    select.innerHTML = '<option value="">Select a train</option>' +
      trains.map(train => `
        <option value="${train.id}">
          ${train.trainName} - ${train.origin} to ${train.destination} - ${formatCurrency(train.price)}
        </option>
      `).join('');
    
    select.addEventListener('change', async (e) => {
      if (e.target.value) {
        const train = trains.find(t => t.id === e.target.value);
        if (train) {
          selectedTrain = train;
          saveToStorage('selectedTrain', train);
          displayTrainInfo(train);
        }
      }
    });
  } catch (error) {
    showError('Failed to load trains: ' + error.message);
  }
}

// Setup booking form
function setupBookingForm() {
  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', handleBookingSubmit);
    
    // Update total price on seat number change
    const seatsInput = document.getElementById('seats');
    if (seatsInput) {
      seatsInput.addEventListener('input', updateTotalPrice);
    }
  }
}

// Update total price
function updateTotalPrice() {
  if (!selectedTrain) return;
  
  const seats = parseInt(document.getElementById('seats').value) || 0;
  const totalPrice = selectedTrain.price * seats;
  
  const totalPriceElement = document.getElementById('total-price');
  if (totalPriceElement) {
    totalPriceElement.textContent = formatCurrency(totalPrice);
  }
}

// Handle booking submission
async function handleBookingSubmit(e) {
  e.preventDefault();
  
  if (!selectedTrain) {
    showError('Please select a train first');
    return;
  }
  
  const formData = {
    trainId: selectedTrain.id,
    passengerName: document.getElementById('name').value.trim(),
    passengerEmail: document.getElementById('email').value.trim(),
    passengerPhone: document.getElementById('phone').value.trim(),
    numberOfSeats: parseInt(document.getElementById('seats').value),
    travelDate: document.getElementById('travel-date').value,
    seatNumbers: document.getElementById('seat-numbers').value.trim()
  };
  
  // Validation
  if (!formData.passengerName) {
    showError('Please enter your name');
    return;
  }
  
  if (!validateEmail(formData.passengerEmail)) {
    showError('Please enter a valid email address');
    return;
  }
  
  if (!validatePhone(formData.passengerPhone)) {
    showError('Please enter a valid phone number');
    return;
  }
  
  if (formData.numberOfSeats < 1) {
    showError('Please select at least 1 seat');
    return;
  }
  
  if (formData.numberOfSeats > selectedTrain.availableSeats) {
    showError(`Only ${selectedTrain.availableSeats} seats available`);
    return;
  }
  
  if (!formData.travelDate) {
    showError('Please select a travel date');
    return;
  }
  
  try {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    const response = await apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    if (response.success) {
      showSuccess('Booking created successfully!');
      
      // Save booking reference to localStorage
      saveToStorage('lastBooking', response.data);
      
      // Show booking confirmation
      displayBookingConfirmation(response.data);
      
      // Reset form
      e.target.reset();
      removeFromStorage('selectedTrain');
      selectedTrain = null;
      
      // Reload user bookings
      setTimeout(() => {
        loadUserBookings();
      }, 1000);
    }
  } catch (error) {
    showError('Booking failed: ' + error.message);
  } finally {
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm Booking';
  }
}

// Display booking confirmation
function displayBookingConfirmation(booking) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>✓ Booking Confirmed!</h2>
      <div class="booking-confirmation">
        <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
        <p><strong>Train:</strong> ${booking.trainName} (${booking.trainNumber})</p>
        <p><strong>Route:</strong> ${booking.origin} → ${booking.destination}</p>
        <p><strong>Date:</strong> ${formatDate(booking.travelDate)}</p>
        <p><strong>Departure:</strong> ${booking.departureTime}</p>
        <p><strong>Seats:</strong> ${booking.numberOfSeats}</p>
        <p><strong>Total Price:</strong> ${formatCurrency(booking.totalPrice)}</p>
        <p class="booking-note">A confirmation email has been sent to ${booking.passengerEmail}</p>
      </div>
      <button class="btn btn-primary" onclick="closeModal()">Close</button>
      <button class="btn btn-secondary" onclick="window.location.href='my-bookings.html'">
        View My Bookings
      </button>
    </div>
  `;
  document.body.appendChild(modal);
  
  setTimeout(() => modal.classList.add('show'), 10);
}

// Close modal
function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

// Load user bookings (for logged-in user - simplified)
async function loadUserBookings() {
  const container = document.getElementById('user-bookings');
  if (!container) return;
  
  const email = document.getElementById('email')?.value;
  if (!email) return;
  
  try {
    const response = await apiFetch(`/bookings/search?email=${email}`);
    userBookings = response.data;
    
    if (userBookings.length > 0) {
      displayUserBookings(userBookings);
    }
  } catch (error) {
    console.error('Failed to load user bookings:', error);
  }
}

// Display user bookings
function displayUserBookings(bookings) {
  const container = document.getElementById('user-bookings');
  if (!container) return;
  
  container.innerHTML = `
    <h3>Your Recent Bookings</h3>
    ${bookings.slice(0, 3).map(booking => `
      <div class="booking-item">
        <div><strong>${booking.trainName}</strong></div>
        <div>${booking.origin} → ${booking.destination}</div>
        <div>Ref: ${booking.bookingReference}</div>
      </div>
    `).join('')}
  `;
}
