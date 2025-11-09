// My Bookings Page JavaScript

let userBookings = [];

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
  setupSearchForm();
  loadLastBooking();
});

// Setup search form
function setupSearchForm() {
  const form = document.getElementById('search-bookings-form');
  if (form) {
    form.addEventListener('submit', handleSearchBookings);
  }
}

// Load last booking from localStorage
function loadLastBooking() {
  const lastBooking = getFromStorage('lastBooking');
  if (lastBooking) {
    document.getElementById('search-email').value = lastBooking.passengerEmail;
    searchBookingsByEmail(lastBooking.passengerEmail);
  }
}

// Handle search bookings
async function handleSearchBookings(e) {
  e.preventDefault();
  
  const email = document.getElementById('search-email').value.trim();
  const bookingRef = document.getElementById('search-ref').value.trim();
  
  if (!email && !bookingRef) {
    showError('Please enter email or booking reference');
    return;
  }
  
  if (email) {
    await searchBookingsByEmail(email);
  } else if (bookingRef) {
    await searchBookingByReference(bookingRef);
  }
}

// Search bookings by email
async function searchBookingsByEmail(email) {
  if (!validateEmail(email)) {
    showError('Please enter a valid email address');
    return;
  }
  
  try {
    showLoading('bookings-container');
    const response = await apiFetch(`/bookings/search?email=${encodeURIComponent(email)}`);
    userBookings = response.data;
    displayBookings(userBookings);
  } catch (error) {
    document.getElementById('bookings-container').innerHTML = 
      `<div class="no-results"><p>Failed to load bookings: ${error.message}</p></div>`;
  }
}

// Search booking by reference
async function searchBookingByReference(ref) {
  try {
    showLoading('bookings-container');
    const response = await apiFetch('/bookings');
    const booking = response.data.find(b => b.bookingReference === ref);
    
    if (booking) {
      userBookings = [booking];
      displayBookings(userBookings);
    } else {
      document.getElementById('bookings-container').innerHTML = 
        '<div class="no-results"><p>No booking found with this reference</p></div>';
    }
  } catch (error) {
    document.getElementById('bookings-container').innerHTML = 
      `<div class="no-results"><p>Failed to load booking: ${error.message}</p></div>`;
  }
}

// Display bookings
function displayBookings(bookings) {
  const container = document.getElementById('bookings-container');
  
  if (!bookings || bookings.length === 0) {
    container.innerHTML = '<div class="no-results"><p>No bookings found</p></div>';
    return;
  }
  
  container.innerHTML = bookings.map(booking => `
    <div class="booking-card ${booking.status.toLowerCase()}">
      <div class="booking-header">
        <div class="booking-ref">
          <span class="label">Booking Reference</span>
          <span class="value">${booking.bookingReference}</span>
        </div>
        <div class="booking-status status-${booking.status.toLowerCase()}">
          ${booking.status}
        </div>
      </div>
      
      <div class="booking-details">
        <div class="detail-section">
          <h4>Train Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Train:</span>
              <span class="value">${booking.trainName} (${booking.trainNumber})</span>
            </div>
            <div class="detail-item">
              <span class="label">Route:</span>
              <span class="value">${booking.origin} → ${booking.destination}</span>
            </div>
            <div class="detail-item">
              <span class="label">Departure:</span>
              <span class="value">${booking.departureTime}</span>
            </div>
            <div class="detail-item">
              <span class="label">Arrival:</span>
              <span class="value">${booking.arrivalTime}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Passenger Information</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Name:</span>
              <span class="value">${booking.passengerName}</span>
            </div>
            <div class="detail-item">
              <span class="label">Email:</span>
              <span class="value">${booking.passengerEmail}</span>
            </div>
            <div class="detail-item">
              <span class="label">Phone:</span>
              <span class="value">${booking.passengerPhone}</span>
            </div>
            <div class="detail-item">
              <span class="label">Travel Date:</span>
              <span class="value">${formatDate(booking.travelDate)}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>Booking Details</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">Number of Seats:</span>
              <span class="value">${booking.numberOfSeats}</span>
            </div>
            ${booking.seatNumbers ? `
              <div class="detail-item">
                <span class="label">Seat Numbers:</span>
                <span class="value">${booking.seatNumbers}</span>
              </div>
            ` : ''}
            <div class="detail-item">
              <span class="label">Total Price:</span>
              <span class="value price">${formatCurrency(booking.totalPrice)}</span>
            </div>
            <div class="detail-item">
              <span class="label">Booking Date:</span>
              <span class="value">${formatDate(booking.bookingDate)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="booking-actions">
        ${booking.status !== 'Cancelled' ? `
          <button class="btn btn-warning" onclick="cancelBooking('${booking.id}')">
            Cancel Booking
          </button>
        ` : ''}
        <button class="btn btn-secondary" onclick="printBooking('${booking.id}')">
          Print Ticket
        </button>
        <button class="btn btn-secondary" onclick="downloadBooking('${booking.id}')">
          Download PDF
        </button>
      </div>
    </div>
  `).join('');
}

// Cancel booking
async function cancelBooking(id) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }
  
  try {
    const response = await apiFetch(`/bookings/${id}/cancel`, {
      method: 'PATCH'
    });
    
    if (response.success) {
      showSuccess('Booking cancelled successfully!');
      
      // Reload bookings
      const email = document.getElementById('search-email').value;
      if (email) {
        await searchBookingsByEmail(email);
      }
    }
  } catch (error) {
    showError('Failed to cancel booking: ' + error.message);
  }
}

// Print booking
function printBooking(id) {
  const booking = userBookings.find(b => b.id === id);
  if (!booking) return;
  
  // Create a print-friendly version
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking ${booking.bookingReference}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #2c3e50; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <h1>Railway Station Management System</h1>
      <h2>Booking Confirmation</h2>
      
      <div class="section">
        <p><span class="label">Booking Reference:</span> ${booking.bookingReference}</p>
        <p><span class="label">Status:</span> ${booking.status}</p>
      </div>
      
      <div class="section">
        <h3>Train Information</h3>
        <table>
          <tr><td class="label">Train</td><td>${booking.trainName} (${booking.trainNumber})</td></tr>
          <tr><td class="label">Route</td><td>${booking.origin} → ${booking.destination}</td></tr>
          <tr><td class="label">Date</td><td>${formatDate(booking.travelDate)}</td></tr>
          <tr><td class="label">Departure</td><td>${booking.departureTime}</td></tr>
          <tr><td class="label">Arrival</td><td>${booking.arrivalTime}</td></tr>
        </table>
      </div>
      
      <div class="section">
        <h3>Passenger Information</h3>
        <table>
          <tr><td class="label">Name</td><td>${booking.passengerName}</td></tr>
          <tr><td class="label">Email</td><td>${booking.passengerEmail}</td></tr>
          <tr><td class="label">Phone</td><td>${booking.passengerPhone}</td></tr>
          <tr><td class="label">Seats</td><td>${booking.numberOfSeats}</td></tr>
          <tr><td class="label">Total Price</td><td>${formatCurrency(booking.totalPrice)}</td></tr>
        </table>
      </div>
      
      <script>window.onload = () => window.print();</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Download booking (simplified - just alerts for now)
function downloadBooking(id) {
  const booking = userBookings.find(b => b.id === id);
  if (booking) {
    alert('PDF download functionality would be implemented here.\n\nBooking Reference: ' + booking.bookingReference);
  }
}
