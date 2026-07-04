<div align="center">

# 🌊 Varuna - Smart Irrigation Dashboard

**A modern, intelligent irrigation management system that combines real-time weather data, soil monitoring, and AI-powered decision making to optimize agricultural water usage.**

[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com/Ahmed-Farouk10/Varuna)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)

[Features](#-features) • [Technologies](#-technologies) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**Varuna** is a comprehensive smart irrigation management platform designed to revolutionize agricultural water management. Named after the Hindu deity of water, Varuna empowers farmers and agricultural professionals with data-driven insights to optimize water usage, reduce waste, and maximize crop yields.

### Key Highlights

- 🤖 **AI-Powered Intelligence** - Leverages Groq AI for real-time irrigation recommendations
- 📊 **Data-Driven Insights** - Comprehensive analytics and visualization tools
- ⚡ **Real-Time Monitoring** - Live updates via WebSocket connections
- 🌍 **Weather Integration** - Accurate forecasts from WeatherAPI.com
- 💧 **Smart Water Management** - Optimize irrigation schedules based on multiple data points
- 🎨 **Modern UI/UX** - Beautiful, responsive design with 3D animations

### Problem It Solves

Traditional irrigation systems often rely on manual scheduling or basic timers, leading to:
- Water waste from over-irrigation
- Crop stress from under-irrigation
- Increased operational costs
- Environmental impact

Varuna addresses these challenges by providing intelligent, data-driven irrigation recommendations that consider weather patterns, soil conditions, and historical data.

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🌤️ **Real-time Weather Integration** | Get accurate weather forecasts and current conditions from WeatherAPI.com. Includes temperature, humidity, precipitation, and wind speed data. |
| 🌱 **Soil Monitoring** | Track soil moisture, temperature, and pH levels with interactive, real-time charts. Monitor multiple fields simultaneously. |
| 🤖 **AI-Powered Assistant** | Chat with an intelligent irrigation advisor powered by Groq AI. Get personalized recommendations based on your specific conditions. |
| 📊 **Analytics Dashboard** | Visualize irrigation data with interactive charts, historical trends, and predictive analytics. Export reports for analysis. |
| ⚡ **Real-time Updates** | Socket.IO for live data synchronization between frontend and backend. Instant notifications for system status changes. |
| 🎨 **Modern UI** | Beautiful, responsive design with smooth animations, 3D visualizations using Spline, and intuitive navigation. |
| 📝 **Irrigation Logs** | Comprehensive logging system tracking all irrigation events, system status changes, and sensor readings with timestamps. |
| 🔍 **System Status Monitoring** | Real-time monitoring of pump status, sensor health, and water supply levels with alert notifications. |

### Advanced Features

- **Multi-Field Management** - Monitor and manage multiple irrigation fields from a single dashboard
- **Historical Data Analysis** - Review past irrigation patterns and optimize future schedules
- **Customizable Alerts** - Set up notifications for critical system events
- **Export Capabilities** - Download irrigation logs and analytics reports
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme** - Customizable interface themes (if implemented)
- **3D Visualizations** - Interactive 3D models and animations using Spline

---

## 🛠️ Technologies

### Frontend Stack

<div align="center">

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | [React](https://reactjs.org/) | 19.0.0 | Modern UI library for building interactive interfaces |
| **Build Tool** | [Vite](https://vitejs.dev/) | 6.2.0 | Next-generation frontend build tool with HMR |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4.17 | Utility-first CSS framework for rapid UI development |
| **Routing** | [React Router DOM](https://reactrouter.com/) | 7.5.0 | Declarative routing for single-page applications |
| **Charts** | [Chart.js](https://www.chartjs.org/) | 4.4.9 | Simple yet flexible JavaScript charting library |
| **Real-time** | [Socket.IO Client](https://socket.io/) | 4.8.1 | Real-time bidirectional event-based communication |
| **HTTP Client** | [Axios](https://axios-http.com/) | 1.9.0 | Promise-based HTTP client for API requests |
| **3D Graphics** | [Spline](https://spline.design/) | 4.0.0 | 3D design and animation tool integration |
| **Icons** | [Heroicons](https://heroicons.com/) | 2.2.0 | Beautiful hand-crafted SVG icons |
| **Particles** | [TSParticles](https://particles.js.org/) | 3.8.1 | Lightweight JavaScript library for creating particles |

</div>

### Backend Stack

<div align="center">

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | [Python](https://www.python.org/) | 3.8+ | High-level programming language |
| **Framework** | [Flask](https://flask.palletsprojects.com/) | 2.3.3 | Lightweight WSGI web application framework |
| **WebSocket** | [Flask-SocketIO](https://flask-socketio.readthedocs.io/) | 5.3.2+ | Socket.IO integration for Flask |
| **Database** | [PyMongo](https://pymongo.readthedocs.io/) | 4.6.1 | MongoDB driver for Python |
| **AI/ML** | [Groq API](https://groq.com/) | 0.4.1 | High-performance AI inference platform |
| **Weather** | [WeatherAPI.com](https://www.weatherapi.com/) | - | Weather data service |
| **HTTP** | [Requests](https://requests.readthedocs.io/) | 2.31.0 | HTTP library for making API calls |
| **CORS** | [Flask-CORS](https://flask-cors.readthedocs.io/) | 4.0.0 | Cross-Origin Resource Sharing support |
| **Environment** | [Python-dotenv](https://pypi.org/project/python-dotenv/) | 1.0.0 | Environment variable management |

</div>

### Database

- **MongoDB Atlas** - Cloud-hosted NoSQL database for storing:
  - Irrigation logs and history
  - Soil sensor data
  - System settings and configurations
  - User preferences
  - AI conversation history

### External Services

- **Groq API** - AI inference for intelligent irrigation recommendations
- **WeatherAPI.com** - Real-time weather data and forecasts
- **MongoDB Atlas** - Cloud database hosting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │   Analytics  │  │     Chat     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │  Socket.IO     │                        │
│                    │  Client        │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   REST API /     │
                    │   WebSocket      │
                    └────────┬─────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                  Backend (Flask + Python)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Weather    │  │  Irrigation  │  │  AI Agent    │      │
│  │   Service    │  │   System     │  │   (Groq)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │               │
│         └──────────────────┼──────────────────┘               │
│                            │                                  │
│                    ┌───────▼────────┐                        │
│                    │  Flask-SocketIO  │                        │
│                    │  Server          │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │   MongoDB Atlas   │
                    │   (Database)      │
                    └───────────────────┘
                             │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼─────────┐  ┌───────▼────────┐
│  WeatherAPI   │  │    Groq API       │  │   MongoDB     │
│   .com        │  │    (AI)           │  │   Atlas       │
└───────────────┘  └───────────────────┘  └───────────────┘
```

### Data Flow

1. **User Interaction** → Frontend captures user input and system events
2. **API Requests** → Frontend sends HTTP requests to Flask backend
3. **WebSocket Connection** → Real-time updates via Socket.IO
4. **Backend Processing** → Flask processes requests, calls external APIs
5. **Database Operations** → MongoDB stores and retrieves data
6. **AI Processing** → Groq API provides intelligent recommendations
7. **Response** → Backend sends processed data back to frontend
8. **UI Update** → Frontend updates components with new data

---

## 📦 Project Structure

```
Varuna/
│
├── 📁 frontend/                          # React + Vite frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/               # Reusable React components
│   │   │   ├── ChatInterface.jsx        # AI chat interface component
│   │   │   ├── WeatherSection.jsx       # Weather display component
│   │   │   ├── IrrigationLogs.jsx       # Irrigation history logs
│   │   │   ├── SoilMoistureChart.jsx    # Soil data visualization
│   │   │   ├── Layout.jsx               # Main layout wrapper
│   │   │   ├── Navbar.jsx               # Navigation bar component
│   │   │   ├── PetalParticles.jsx           # Particle effects
│   │   │   └── ErrorBoundary.jsx        # Error handling component
│   │   │
│   │   ├── 📁 pages/                     # Page components
│   │   │   ├── LandingPage.jsx          # Animated landing page
│   │   │   ├── Home.jsx                  # Main dashboard page
│   │   │   ├── Analytics.jsx            # Analytics and charts page
│   │   │   ├── Weather.jsx               # Detailed weather page
│   │   │   ├── Chat.jsx                  # Dedicated chat page
│   │   │   └── Settings.jsx              # Application settings
│   │   │
│   │   ├── 📁 styles/                    # CSS stylesheets
│   │   │   └── Home.css                  # Home page styles
│   │   │
│   │   ├── 📁 utils/                     # Utility functions
│   │   │
│   │   ├── 📁 assets/                    # Static assets (images, fonts)
│   │   │
│   │   ├── App.jsx                       # Main application component
│   │   └── main.jsx                      # Application entry point
│   │
│   ├── 📁 public/                        # Public static assets
│   │   └── vite.svg                      # Vite logo
│   │
│   ├── 📁 fonts/                         # Custom font files
│   │
│   ├── package.json                      # Frontend dependencies
│   ├── vite.config.js                    # Vite configuration
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── postcss.config.js                 # PostCSS configuration
│   ├── eslint.config.js                  # ESLint configuration
│   └── index.html                        # HTML entry point
│
├── 📁 python_ai/                         # Flask + Socket.IO backend
│   ├── app.py                            # Main Flask application and API routes
│   ├── agents.py                         # AI agent logic using Groq API
│   ├── weather.py                        # Weather service integration
│   ├── irrigation.py                     # Irrigation system logic and MongoDB operations
│   ├── config.py                         # Configuration management
│   ├── requirements.txt                  # Python dependencies
│   └── .env                              # Environment variables (not committed)
│
├── 📁 backend/                            # Node.js backend (optional)
│   ├── server.js                         # Node.js server
│   └── package.json                      # Node.js dependencies
│
├── .gitignore                            # Git ignore rules
└── README.md                             # Project documentation
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16+ and npm ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/downloads/))
- **MongoDB Atlas Account** ([Sign up](https://www.mongodb.com/cloud/atlas/register)) or local MongoDB instance
- **Git** ([Download](https://git-scm.com/downloads))

### Required API Keys

You'll need to obtain API keys from the following services:

1. **WeatherAPI.com** - [Get Free API Key](https://www.weatherapi.com/signup.aspx)
   - Free tier: 1 million calls/month
   - No credit card required

2. **Groq API** - [Get API Key](https://console.groq.com/)
   - Free tier available
   - High-performance AI inference

3. **MongoDB Atlas** - [Create Free Cluster](https://www.mongodb.com/cloud/atlas/register)
   - Free tier: 512MB storage
   - Get connection string

### Step-by-Step Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Ahmed-Farouk10/Varuna.git
cd Varuna
```

#### 2. Setup Python Backend

```bash
# Navigate to backend directory
cd python_ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Configure Environment Variables

Create a `.env` file in the `python_ai/` directory with your configuration:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Weather API
WEATHER_API_KEY=your_weatherapi_key_here

# Groq AI API
GROQ_API_KEY=your_groq_api_key_here
```

> ⚠️ **Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

#### 4. Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

#### 5. Verify Installation

```bash
# Check Python version
python --version  # Should be 3.8 or higher

# Check Node.js version
node --version   # Should be 16 or higher

# Check npm version
npm --version
```

---

## ⚙️ Configuration

### Backend Configuration

The backend can be configured through environment variables in the `.env` file:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `WEATHER_API_KEY` | WeatherAPI.com API key | Yes |
| `GROQ_API_KEY` | Groq API key for AI features | Yes |

### Frontend Configuration

Frontend configuration is handled through environment variables (create `frontend/.env` if needed):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5001` |
| `VITE_SOCKET_URL` | WebSocket server URL | `http://localhost:5001` |

---

## 🏃 Running the Project

### Development Mode

#### Terminal 1: Start Backend Server

```bash
cd python_ai
python app.py
```

You should see confirmation messages indicating the server has started successfully.

#### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see confirmation messages with the local development server URL.

### Access the Application

1. Open your browser and navigate to the frontend development server URL
2. You'll see the animated landing page with 3D graphics
3. Click **"Go to Dashboard"** to access the main interface
4. On first launch, configure your field location

### Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist/` directory.

---

## 📖 Usage

### Getting Started

1. **Initial Setup**
   - Launch the application
   - Enter your field location when prompted
   - Configure field ID and other settings

2. **Dashboard Overview**
   - View real-time weather conditions
   - Monitor soil moisture levels
   - Check system status indicators
   - Review quick statistics

3. **AI Assistant**
   - Click on the chat interface
   - Ask questions like:
     - "Should I water my crops today?"
     - "What's the best irrigation schedule for this week?"
     - "How is my soil moisture level?"
   - Get AI-powered recommendations

4. **Analytics**
   - Navigate to the Analytics page
   - View historical data charts
   - Analyze irrigation patterns
   - Export reports

### Common Use Cases

#### Monitoring Soil Moisture

```javascript
// The system automatically tracks soil moisture
// View real-time data on the dashboard
// Set alerts for low moisture levels
```

#### Getting Irrigation Recommendations

1. Open the chat interface
2. Type: "I need irrigation advice for my field"
3. The AI will analyze:
   - Current weather conditions
   - Soil moisture levels
   - Historical data
   - Best practices

#### Reviewing Irrigation History

1. Navigate to Irrigation Logs
2. Filter by date range
3. Review past irrigation events
4. Analyze patterns and trends

---

## 📡 API Documentation

### Base URL

The API base URL depends on your configuration. By default, it runs on `http://localhost:5001/api` in development.

### Endpoints

#### Weather Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/weather/:city` | Get current weather | `city` (string) |
| `GET` | `/forecast/:city` | Get weather forecast | `city` (string), `days` (int, optional) |

**Example Request:**
```bash
curl http://localhost:5001/api/weather/YourCity
```

**Example Response:**
```json
{
  "location": {
    "name": "YourCity",
    "country": "YourCountry"
  },
  "current": {
    "temp_c": 25,
    "humidity": 50,
    "condition": "Clear"
  }
}
```

#### Chat Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/chat` | Send message to AI assistant | `{ "message": "string", "fieldId": "string", "location": "string" }` |

**Example Request:**
```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Should I water my crops today?",
    "fieldId": "field_001",
    "location": "YourLocation"
  }'
```

#### Irrigation Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/irrigation/logs/:fieldId` | Get irrigation logs | `fieldId` (string) |
| `GET` | `/soil/:fieldId` | Get soil data | `fieldId` (string) |
| `POST` | `/irrigation/analyze` | Analyze irrigation needs | Body: `{ "fieldId": "string", "location": "string" }` |

#### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Client → Server | Establish connection |
| `soil_update` | Server → Client | Real-time soil data updates |
| `irrigation_event` | Server → Client | Irrigation event notifications |
| `system_status` | Server → Client | System status updates |

---

## ⚡ Performance

### Optimization Features

- **Code Splitting** - Automatic code splitting with Vite
- **Lazy Loading** - Components loaded on demand
- **Caching** - API response caching for weather data
- **WebSocket** - Efficient real-time updates
- **Database Indexing** - Optimized MongoDB queries

### Performance Metrics

The application is optimized for fast load times and responsive interactions. Performance may vary based on network conditions and system resources.

---

## 🔧 Troubleshooting

### Common Issues

#### Backend Not Starting

**Problem**: Flask server fails to start

**Solutions**:
- Check if the backend port is available
- Verify Python virtual environment is activated
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check `.env` file exists and has correct values

#### Frontend Connection Errors

**Problem**: Frontend can't connect to backend

**Solutions**:
- Verify backend is running
- Check `VITE_API_URL` in frontend environment variables
- Verify CORS is enabled in Flask backend
- Check browser console for specific error messages

#### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
- Verify MongoDB URI in `.env` file
- Check MongoDB Atlas IP whitelist settings
- Ensure MongoDB cluster is running
- Check network connectivity

#### API Key Errors

**Problem**: Weather or AI API returns errors

**Solutions**:
- Verify API keys are correct in `.env` file
- Check API key quotas/limits
- Verify API key permissions
- Test API keys independently

### Getting Help

- Check the [Issues](https://github.com/Ahmed-Farouk10/Varuna/issues) page
- Review the [Documentation](https://github.com/Ahmed-Farouk10/Varuna/wiki)
- Open a new issue with detailed error information

---

## 🗺️ Roadmap

### Planned Features

- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **IoT Integration** - Direct sensor integration support
- [ ] **Machine Learning** - Predictive analytics for irrigation scheduling
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **User Authentication** - Secure user accounts and profiles
- [ ] **Notification System** - Email and SMS alerts
- [ ] **Export Features** - PDF reports and CSV data export
- [ ] **Dark Mode** - Theme customization
- [ ] **Offline Mode** - Work without internet connection
- [ ] **Advanced Analytics** - More detailed insights and predictions

### Version History

- **v1.0.0** (Current) - Initial release with core features
- **v0.9.0** - Beta release with basic functionality
- **v0.1.0** - Early development version

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git fork https://github.com/Ahmed-Farouk10/Varuna.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
   - Use clear, descriptive commit messages
   - Reference issues if applicable

5. **Push to Your Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Add screenshots if UI changes

### Contribution Guidelines

- ✅ Follow the existing code style and conventions
- ✅ Write clear, descriptive commit messages
- ✅ Add comments for complex logic
- ✅ Test your changes before submitting
- ✅ Update documentation if needed
- ✅ Ensure all tests pass
- ✅ Keep pull requests focused on a single feature

### Code Style

- **Python**: Follow PEP 8 style guide
- **JavaScript**: Use ESLint configuration
- **CSS**: Follow Tailwind CSS best practices

### Reporting Issues

When reporting issues, please include:
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, versions)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ **Commercial use** - You can use this project commercially
- ✅ **Modification** - You can modify the code
- ✅ **Distribution** - You can distribute the code
- ✅ **Private use** - You can use it privately
- ❌ **Liability** - No warranty provided
- ❌ **Trademark use** - Cannot use project name/trademark

---

<div align="center">

**Made with ❤️ for smart agriculture**
** Website Link : https://varuna-phi.vercel.app**

[⬆ Back to Top](#-varuna---smart-irrigation-dashboard)

⭐ Star this repo if you find it helpful!

</div>
