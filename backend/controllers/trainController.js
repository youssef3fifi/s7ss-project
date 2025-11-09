const Train = require('../models/Train');

// Get all trains
exports.getAllTrains = (req, res) => {
  try {
    const trains = Train.getAll();
    res.json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trains',
      error: error.message
    });
  }
};

// Get train by ID
exports.getTrainById = (req, res) => {
  try {
    const train = Train.getById(req.params.id);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    res.json({
      success: true,
      data: train
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching train',
      error: error.message
    });
  }
};

// Search trains
exports.searchTrains = (req, res) => {
  try {
    const trains = Train.search(req.query);
    res.json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching trains',
      error: error.message
    });
  }
};

// Create new train
exports.createTrain = (req, res) => {
  try {
    const { trainNumber, trainName, origin, destination, departureTime, arrivalTime, duration, price, totalSeats, days } = req.body;
    
    // Validation
    if (!trainNumber || !trainName || !origin || !destination || !departureTime || !arrivalTime || !price || !totalSeats) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newTrain = Train.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Train created successfully',
      data: newTrain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating train',
      error: error.message
    });
  }
};

// Update train
exports.updateTrain = (req, res) => {
  try {
    const updatedTrain = Train.update(req.params.id, req.body);
    if (!updatedTrain) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    res.json({
      success: true,
      message: 'Train updated successfully',
      data: updatedTrain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating train',
      error: error.message
    });
  }
};

// Delete train
exports.deleteTrain = (req, res) => {
  try {
    const deletedTrain = Train.delete(req.params.id);
    if (!deletedTrain) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }
    res.json({
      success: true,
      message: 'Train deleted successfully',
      data: deletedTrain
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting train',
      error: error.message
    });
  }
};
