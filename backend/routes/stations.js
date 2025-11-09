const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

// Station routes
router.get('/', stationController.getAllStations);
router.get('/search', stationController.searchStations);
router.get('/code/:code', stationController.getStationByCode);
router.get('/:id', stationController.getStationById);
router.post('/', stationController.createStation);
router.put('/:id', stationController.updateStation);
router.delete('/:id', stationController.deleteStation);

module.exports = router;
