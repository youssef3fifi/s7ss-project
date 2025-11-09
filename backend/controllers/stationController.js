const Station = require('../models/Station');

// Get all stations
exports.getAllStations = (req, res) => {
  try {
    const stations = Station.getAll();
    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stations',
      error: error.message
    });
  }
};

// Get station by ID
exports.getStationById = (req, res) => {
  try {
    const station = Station.getById(req.params.id);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }
    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching station',
      error: error.message
    });
  }
};

// Get station by code
exports.getStationByCode = (req, res) => {
  try {
    const station = Station.getByCode(req.params.code);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }
    res.json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching station',
      error: error.message
    });
  }
};

// Search stations by city
exports.searchStations = (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required'
      });
    }
    const stations = Station.getByCity(city);
    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching stations',
      error: error.message
    });
  }
};

// Create new station
exports.createStation = (req, res) => {
  try {
    const { name, code, city, address, facilities, platforms } = req.body;
    
    // Validation
    if (!name || !code || !city || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newStation = Station.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Station created successfully',
      data: newStation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating station',
      error: error.message
    });
  }
};

// Update station
exports.updateStation = (req, res) => {
  try {
    const updatedStation = Station.update(req.params.id, req.body);
    if (!updatedStation) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }
    res.json({
      success: true,
      message: 'Station updated successfully',
      data: updatedStation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating station',
      error: error.message
    });
  }
};

// Delete station
exports.deleteStation = (req, res) => {
  try {
    const deletedStation = Station.delete(req.params.id);
    if (!deletedStation) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }
    res.json({
      success: true,
      message: 'Station deleted successfully',
      data: deletedStation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting station',
      error: error.message
    });
  }
};
