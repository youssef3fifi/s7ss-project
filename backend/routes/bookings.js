const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking routes
router.get('/', bookingController.getAllBookings);
router.get('/search', bookingController.getBookingsByEmail);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
