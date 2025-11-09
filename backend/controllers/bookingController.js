const Booking = require('../models/Booking');
const Train = require('../models/Train');

// Get all bookings
exports.getAllBookings = (req, res) => {
  try {
    const bookings = Booking.getAll();
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get booking by ID
exports.getBookingById = (req, res) => {
  try {
    const booking = Booking.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Get bookings by email
exports.getBookingsByEmail = (req, res) => {
  try {
    const bookings = Booking.getByEmail(req.query.email);
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Create new booking
exports.createBooking = (req, res) => {
  try {
    const { trainId, passengerName, passengerEmail, passengerPhone, numberOfSeats, travelDate, seatNumbers } = req.body;
    
    // Validation
    if (!trainId || !passengerName || !passengerEmail || !passengerPhone || !numberOfSeats || !travelDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check train availability
    const train = Train.getById(trainId);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    if (train.availableSeats < numberOfSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${train.availableSeats} seats available`
      });
    }

    // Calculate total price
    const totalPrice = train.price * numberOfSeats;

    // Create booking
    const bookingData = {
      ...req.body,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      origin: train.origin,
      destination: train.destination,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      totalPrice
    };

    const newBooking = Booking.create(bookingData);

    // Update train available seats
    Train.updateAvailableSeats(trainId, numberOfSeats);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Update booking
exports.updateBooking = (req, res) => {
  try {
    const updatedBooking = Booking.update(req.params.id, req.body);
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// Cancel booking
exports.cancelBooking = (req, res) => {
  try {
    const booking = Booking.getById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    const cancelledBooking = Booking.cancel(req.params.id);

    // Return seats to train
    const train = Train.getById(booking.trainId);
    if (train) {
      train.availableSeats += booking.numberOfSeats;
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// Delete booking
exports.deleteBooking = (req, res) => {
  try {
    const deletedBooking = Booking.delete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: deletedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};
