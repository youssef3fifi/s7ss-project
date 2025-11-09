// Train Model
// In-memory storage for simplicity, can be replaced with MongoDB

let trains = [
  {
    id: '1',
    trainNumber: 'T001',
    trainName: 'Express 100',
    origin: 'Cairo',
    destination: 'Alexandria',
    departureTime: '08:00',
    arrivalTime: '10:30',
    duration: '2h 30m',
    price: 50,
    availableSeats: 100,
    totalSeats: 100,
    status: 'On Time',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    id: '2',
    trainNumber: 'T002',
    trainName: 'Fast Track 200',
    origin: 'Cairo',
    destination: 'Luxor',
    departureTime: '14:00',
    arrivalTime: '22:00',
    duration: '8h',
    price: 120,
    availableSeats: 80,
    totalSeats: 80,
    status: 'On Time',
    days: ['Monday', 'Wednesday', 'Friday', 'Sunday']
  },
  {
    id: '3',
    trainNumber: 'T003',
    trainName: 'Night Express',
    origin: 'Alexandria',
    destination: 'Aswan',
    departureTime: '20:00',
    arrivalTime: '08:00',
    duration: '12h',
    price: 180,
    availableSeats: 60,
    totalSeats: 60,
    status: 'On Time',
    days: ['Tuesday', 'Thursday', 'Saturday']
  },
  {
    id: '4',
    trainNumber: 'T004',
    trainName: 'City Shuttle',
    origin: 'Cairo',
    destination: 'Giza',
    departureTime: '06:00',
    arrivalTime: '06:45',
    duration: '45m',
    price: 15,
    availableSeats: 150,
    totalSeats: 150,
    status: 'On Time',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    id: '5',
    trainNumber: 'T005',
    trainName: 'Business Express',
    origin: 'Cairo',
    destination: 'Port Said',
    departureTime: '09:00',
    arrivalTime: '12:30',
    duration: '3h 30m',
    price: 85,
    availableSeats: 50,
    totalSeats: 50,
    status: 'On Time',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
];

class Train {
  static getAll() {
    return trains;
  }

  static getById(id) {
    return trains.find(train => train.id === id);
  }

  static create(trainData) {
    const newTrain = {
      id: Date.now().toString(),
      ...trainData,
      availableSeats: trainData.totalSeats,
      status: 'On Time'
    };
    trains.push(newTrain);
    return newTrain;
  }

  static update(id, trainData) {
    const index = trains.findIndex(train => train.id === id);
    if (index !== -1) {
      trains[index] = { ...trains[index], ...trainData };
      return trains[index];
    }
    return null;
  }

  static delete(id) {
    const index = trains.findIndex(train => train.id === id);
    if (index !== -1) {
      const deleted = trains[index];
      trains.splice(index, 1);
      return deleted;
    }
    return null;
  }

  static search(query) {
    const { origin, destination, date } = query;
    return trains.filter(train => {
      let matches = true;
      if (origin) {
        matches = matches && train.origin.toLowerCase().includes(origin.toLowerCase());
      }
      if (destination) {
        matches = matches && train.destination.toLowerCase().includes(destination.toLowerCase());
      }
      // Date filtering can be enhanced based on train schedule
      return matches;
    });
  }

  static updateAvailableSeats(id, seatsBooked) {
    const train = this.getById(id);
    if (train && train.availableSeats >= seatsBooked) {
      train.availableSeats -= seatsBooked;
      return train;
    }
    return null;
  }
}

module.exports = Train;
