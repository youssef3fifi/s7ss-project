# Railway Station Management System

A professional full-stack railway station management system built with Node.js (Express) backend and vanilla HTML/CSS/JavaScript frontend. This application provides comprehensive train schedule management, ticket booking, and administrative features, optimized for AWS EC2 deployment.

## 🚀 Features

### Backend Features
- **RESTful API** with Express.js
- **CRUD Operations** for trains, bookings, and stations
- **Search & Filter** functionality for trains
- **CORS Configuration** for cross-origin requests
- **Error Handling** middleware
- **Environment-based Configuration**
- **In-memory Data Storage** (easily replaceable with MongoDB)

### Frontend Features
- **5 Professional Pages**:
  1. **Home Page** - Overview, quick booking, and featured routes
  2. **Train Schedule** - Browse and search all available trains
  3. **Booking Page** - Book tickets with seat selection
  4. **My Bookings** - View and manage bookings
  5. **Admin Dashboard** - Manage trains, bookings, and stations

- **Responsive Design** - Mobile-friendly layout
- **Real-time Updates** - Dynamic content loading
- **Form Validation** - Client-side validation
- **Error Handling** - User-friendly error messages
- **Modern UI** - Professional gradient design

## 📁 Project Structure

```
/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── package.json              # Backend dependencies
│   ├── .env.example              # Environment variables template
│   ├── ecosystem.config.js       # PM2 configuration
│   ├── routes/
│   │   ├── trains.js             # Train routes
│   │   ├── bookings.js           # Booking routes
│   │   └── stations.js           # Station routes
│   ├── models/
│   │   ├── Train.js              # Train model
│   │   ├── Booking.js            # Booking model
│   │   └── Station.js            # Station model
│   ├── controllers/
│   │   ├── trainController.js    # Train business logic
│   │   ├── bookingController.js  # Booking business logic
│   │   └── stationController.js  # Station business logic
│   └── middleware/
│       └── errorHandler.js       # Error handling middleware
├── frontend/
│   ├── index.html                # Home page
│   ├── schedule.html             # Train schedule page
│   ├── booking.html              # Booking page
│   ├── my-bookings.html          # User bookings page
│   ├── admin.html                # Admin dashboard
│   ├── css/
│   │   └── style.css             # Main stylesheet
│   └── js/
│       ├── config.js             # API configuration
│       ├── main.js               # Utility functions
│       ├── schedule.js           # Schedule page logic
│       ├── booking.js            # Booking page logic
│       ├── admin.js              # Admin page logic
│       └── my-bookings.js        # My bookings page logic
├── README.md                     # This file
└── .gitignore                    # Git ignore rules
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/youssef3fifi/s7ss-project.git
cd s7ss-project
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start the backend server**
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The backend server will start on `http://localhost:3000`

5. **Open the frontend**
- For development, you can use any local HTTP server:
```bash
# Using Python 3
cd ../frontend
python3 -m http.server 8080

# Using Node.js http-server (install globally first: npm install -g http-server)
cd ../frontend
http-server -p 8080

# Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

The frontend will be accessible at `http://localhost:8080`

## 🌐 AWS EC2 Deployment

### Backend Deployment on EC2

1. **Launch an EC2 Instance**
   - Choose Ubuntu Server 20.04 LTS or Amazon Linux 2
   - Select instance type (t2.micro for free tier)
   - Configure security group to allow:
     - SSH (port 22)
     - HTTP (port 80)
     - Custom TCP (port 3000) for backend API

2. **Connect to your EC2 instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

3. **Install Node.js and npm**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

4. **Install Git and clone repository**
```bash
sudo apt install git -y
git clone https://github.com/youssef3fifi/s7ss-project.git
cd s7ss-project/backend
```

5. **Install dependencies**
```bash
npm install
```

6. **Configure environment**
```bash
cp .env.example .env
nano .env
```

Edit the `.env` file:
```
PORT=3000
NODE_ENV=production
FRONTEND_URL=*
```

7. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

8. **Start the application with PM2**
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

9. **Configure PM2 to start on system boot**
```bash
# Copy and run the command shown by pm2 startup
```

10. **Check application status**
```bash
pm2 status
pm2 logs railway-station-api
```

### Frontend Deployment

#### Option 1: Host on Same EC2 Instance

1. **Install Nginx**
```bash
sudo apt install nginx -y
```

2. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/railway-station
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-ec2-public-ip;

    root /home/ubuntu/s7ss-project/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable the site**
```bash
sudo ln -s /etc/nginx/sites-available/railway-station /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Update frontend API configuration**
```bash
cd /home/ubuntu/s7ss-project/frontend/js
nano config.js
```

The API configuration will automatically detect the hostname.

#### Option 2: Host on AWS S3

1. **Create S3 bucket**
2. **Enable static website hosting**
3. **Upload frontend files**
4. **Update `frontend/js/config.js` with your EC2 backend IP**
5. **Configure bucket policy for public access**

### Accessing the Application

- **Frontend**: `http://your-ec2-public-ip/`
- **Backend API**: `http://your-ec2-public-ip:3000/api`
- **API Documentation**: `http://your-ec2-public-ip:3000/api`

## 📚 API Documentation

### Base URL
```
http://your-server:3000/api
```

### Trains Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trains` | Get all trains |
| GET | `/trains/:id` | Get train by ID |
| GET | `/trains/search?origin=&destination=` | Search trains |
| POST | `/trains` | Create new train |
| PUT | `/trains/:id` | Update train |
| DELETE | `/trains/:id` | Delete train |

### Bookings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/:id` | Get booking by ID |
| GET | `/bookings/search?email=` | Search bookings by email |
| POST | `/bookings` | Create new booking |
| PUT | `/bookings/:id` | Update booking |
| PATCH | `/bookings/:id/cancel` | Cancel booking |
| DELETE | `/bookings/:id` | Delete booking |

### Stations Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stations` | Get all stations |
| GET | `/stations/:id` | Get station by ID |
| GET | `/stations/code/:code` | Get station by code |
| GET | `/stations/search?city=` | Search stations by city |
| POST | `/stations` | Create new station |
| PUT | `/stations/:id` | Update station |
| DELETE | `/stations/:id` | Delete station |

### Example API Requests

**Create a booking:**
```bash
curl -X POST http://your-server:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "trainId": "1",
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "passengerPhone": "+20 123 456 7890",
    "numberOfSeats": 2,
    "travelDate": "2024-12-01",
    "seatNumbers": "A1, A2"
  }'
```

**Search trains:**
```bash
curl "http://your-server:3000/api/trains/search?origin=Cairo&destination=Alexandria"
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:8080
# For EC2: FRONTEND_URL=* or FRONTEND_URL=http://your-ec2-ip

# API Configuration
API_VERSION=v1
```

### CORS Configuration

The backend is configured to accept requests from any origin by default for EC2 deployment. To restrict access, update the `FRONTEND_URL` in `.env`:

```env
FRONTEND_URL=http://your-frontend-domain.com
```

## 🧪 Testing

### Test Backend API

1. **Check server status**
```bash
curl http://localhost:3000/
```

2. **Get all trains**
```bash
curl http://localhost:3000/api/trains
```

3. **Create a booking**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"trainId":"1","passengerName":"Test User","passengerEmail":"test@example.com","passengerPhone":"1234567890","numberOfSeats":1,"travelDate":"2024-12-01"}'
```

### Test Frontend

1. Open the frontend in a browser
2. Navigate through all pages
3. Test the booking flow
4. Check the admin dashboard
5. Verify mobile responsiveness

## 📱 Features Walkthrough

### For Passengers

1. **Home Page** - View featured routes and use quick booking
2. **Train Schedule** - Search and filter trains by origin/destination
3. **Book Ticket** - Select train, enter details, confirm booking
4. **My Bookings** - View bookings by email or booking reference

### For Administrators

1. **Admin Dashboard** - View statistics (trains, bookings, revenue)
2. **Manage Trains** - Add, edit, delete train schedules
3. **Manage Bookings** - View, cancel, or delete bookings
4. **Manage Stations** - Add, edit, delete station information

## 🛡️ Security Considerations

- Environment variables for sensitive configuration
- Input validation on both frontend and backend
- CORS configuration for API access control
- Error handling without exposing sensitive information
- PM2 for process management and auto-restart

## 🔄 Upgrading to MongoDB

To upgrade from in-memory storage to MongoDB:

1. Install MongoDB and Mongoose:
```bash
npm install mongodb mongoose
```

2. Update models to use Mongoose schemas
3. Add MongoDB connection string to `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/railway-station
```

4. Update server.js to connect to MongoDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Support

For issues, questions, or contributions, please open an issue on GitHub.

## 🎯 Future Enhancements

- User authentication and authorization
- Payment gateway integration
- Email notifications
- SMS notifications
- PDF ticket generation
- Real-time seat availability
- Train tracking
- Multi-language support
- Mobile app (React Native)
- Advanced analytics dashboard

## 📸 Screenshots

*(Screenshots would be added here showing the application interface)*

## 🙏 Acknowledgments

Built with modern web technologies for efficient railway station management.

---

**Happy Booking! 🚂**