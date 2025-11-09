// Booking Model
// In-memory storage for simplicity

const { v4: uuidv4 } = require('uuid');

let bookings = [];

class Booking {
  static getAll() {
    return bookings;
  }

  static getById(id) {
    return bookings.find(booking => booking.id === id);
  }

  static getByEmail(email) {
    return bookings.filter(booking => booking.passengerEmail === email);
  }

  static create(bookingData) {
    const newBooking = {
      id: uuidv4(),
      bookingReference: 'BKG' + Date.now().toString().slice(-8),
      status: 'Confirmed',
      bookingDate: new Date().toISOString(),
      ...bookingData
    };
    bookings.push(newBooking);
    return newBooking;
  }

  static update(id, bookingData) {
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...bookingData };
      return bookings[index];
    }
    return null;
  }

  static delete(id) {
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      const deleted = bookings[index];
      bookings.splice(index, 1);
      return deleted;
    }
    return null;
  }

  static cancel(id) {
    const booking = this.getById(id);
    if (booking) {
      booking.status = 'Cancelled';
      return booking;
    }
    return null;
  }
}

module.exports = Booking;
