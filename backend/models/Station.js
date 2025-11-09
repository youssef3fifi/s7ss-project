// Station Model
// In-memory storage for simplicity

let stations = [
  {
    id: '1',
    name: 'Cairo Central Station',
    code: 'CAI',
    city: 'Cairo',
    address: 'Ramses Square, Cairo',
    facilities: ['WiFi', 'Waiting Room', 'Restaurant', 'Parking', 'ATM'],
    platforms: 12,
    contactNumber: '+20-2-1234-5678'
  },
  {
    id: '2',
    name: 'Alexandria Main Station',
    code: 'ALX',
    city: 'Alexandria',
    address: 'El-Mahatta Square, Alexandria',
    facilities: ['WiFi', 'Waiting Room', 'Cafeteria', 'Parking'],
    platforms: 8,
    contactNumber: '+20-3-1234-5678'
  },
  {
    id: '3',
    name: 'Luxor Station',
    code: 'LXR',
    city: 'Luxor',
    address: 'Station Street, Luxor',
    facilities: ['Waiting Room', 'Ticket Office', 'Parking'],
    platforms: 4,
    contactNumber: '+20-95-1234-5678'
  },
  {
    id: '4',
    name: 'Aswan Station',
    code: 'ASW',
    city: 'Aswan',
    address: 'Railway Street, Aswan',
    facilities: ['Waiting Room', 'Cafeteria', 'Parking'],
    platforms: 4,
    contactNumber: '+20-97-1234-5678'
  },
  {
    id: '5',
    name: 'Giza Station',
    code: 'GZA',
    city: 'Giza',
    address: 'Giza Square, Giza',
    facilities: ['WiFi', 'Waiting Room', 'Parking'],
    platforms: 6,
    contactNumber: '+20-2-9876-5432'
  },
  {
    id: '6',
    name: 'Port Said Station',
    code: 'PSD',
    city: 'Port Said',
    address: 'Port Station Road, Port Said',
    facilities: ['Waiting Room', 'Restaurant', 'Parking', 'ATM'],
    platforms: 5,
    contactNumber: '+20-66-1234-5678'
  }
];

class Station {
  static getAll() {
    return stations;
  }

  static getById(id) {
    return stations.find(station => station.id === id);
  }

  static getByCode(code) {
    return stations.find(station => station.code === code);
  }

  static getByCity(city) {
    return stations.filter(station => 
      station.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  static create(stationData) {
    const newStation = {
      id: Date.now().toString(),
      ...stationData
    };
    stations.push(newStation);
    return newStation;
  }

  static update(id, stationData) {
    const index = stations.findIndex(station => station.id === id);
    if (index !== -1) {
      stations[index] = { ...stations[index], ...stationData };
      return stations[index];
    }
    return null;
  }

  static delete(id) {
    const index = stations.findIndex(station => station.id === id);
    if (index !== -1) {
      const deleted = stations[index];
      stations.splice(index, 1);
      return deleted;
    }
    return null;
  }
}

module.exports = Station;
