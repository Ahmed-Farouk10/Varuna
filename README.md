# 🌊 Varuna - Smart Irrigation Dashboard

A modern, intelligent irrigation management system that combines real-time weather data, soil monitoring, and AI-powered decision making to optimize agricultural water usage.

![Varuna Dashboard](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🌤️ **Real-time Weather Integration** - Get accurate weather forecasts and current conditions
- 🌱 **Soil Monitoring** - Track soil moisture, temperature, and pH levels
- 🤖 **AI-Powered Assistant** - Chat with an intelligent irrigation advisor powered by Groq AI
- 📊 **Analytics Dashboard** - Visualize irrigation data with interactive charts
- ⚡ **Real-time Updates** - Socket.IO for live data synchronization
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **MongoDB** (Atlas or local instance)
- **API Keys:**
  - [WeatherAPI.com](https://www.weatherapi.com/) (Free tier available)
  - [Groq API](https://console.groq.com/) (FREE - No credit card required)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Varuna.git
   cd Varuna
   ```

2. **Setup Python Backend**
   ```bash
   cd python_ai
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Create `.env` file in `python_ai/` directory**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/irrigation_db?retryWrites=true&w=majority
   WEATHER_API_KEY=your_weatherapi_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

5. **Run the Application**
   
   **Terminal 1 - Python Backend:**
   ```bash
   cd python_ai
   python app.py
   ```
   Backend runs on `http://localhost:5001`
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

6. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Enjoy the animated landing page, then click "Go to Dashboard"

## 📦 Project Structure

```
Varuna/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── WeatherSection.jsx
│   │   │   └── ...
│   │   └── pages/         # Page components
│   │       ├── LandingPage.jsx  # Animated intro (Spline)
│   │       └── Home.jsx
│   └── package.json
├── python_ai/         # Flask + Socket.IO backend
│   ├── app.py         # Main Flask application
│   ├── agents.py      # AI agent logic (Groq API)
│   ├── weather.py     # Weather service
│   ├── irrigation.py  # Irrigation logic
│   └── requirements.txt
└── backend/           # Node.js backend (optional)
```

## 🌐 Deployment to GitHub Pages

This project is configured for automatic GitHub Pages deployment.

### Prerequisites for Deployment

**Important:** The frontend requires a backend API to function. You must deploy your Python backend separately.

**Deploy Backend First:**
   - Deploy your Python backend to a service like:
     - [Heroku](https://www.heroku.com/)
     - [Railway](https://railway.app/)
     - [Render](https://render.com/)
     - [Fly.io](https://fly.io/)
   - Get your deployed backend URL (e.g., `https://your-backend.herokuapp.com`)
   - **The frontend will not work without a deployed backend**

### Automatic Deployment Steps

1. **Enable GitHub Pages:**
   - Go to your repository → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Configure Backend URLs (Optional but Recommended):**
   - Go to your repository → **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.herokuapp.com`)
     - `VITE_SOCKET_URL`: Your deployed backend URL (same as above)
   - If not set, defaults to `http://localhost:5001` (won't work in production)

3. **Update Repository Name (if different):**
   - If your repository is NOT named `Varuna`, update `frontend/vite.config.js`:
     ```javascript
     base: process.env.NODE_ENV === 'production' ? '/YourRepoName/' : '/',
     ```

4. **Deploy:**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Check the **Actions** tab to see deployment progress

### Access Your Deployed Site

After deployment, your site will be available at:
```
https://yourusername.github.io/Varuna/
```

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
cd frontend
npm install
npm run build
# The 'dist' folder contains the built files
# Upload the contents of 'dist' to GitHub Pages
```

### Troubleshooting

- **404 Errors:** Make sure the base path in `vite.config.js` matches your repository name
- **API Not Working:** Ensure your backend is deployed and CORS is configured to allow your GitHub Pages domain
- **Socket.IO Not Connecting:** Check that `VITE_SOCKET_URL` is set correctly in GitHub Secrets

## 🛠️ Technology Stack

- **Frontend:**
  - React 19
  - Vite
  - Tailwind CSS
  - Socket.IO Client
  - Chart.js
  - Spline (3D animations)

- **Backend:**
  - Python 3.8+
  - Flask
  - Flask-SocketIO
  - PyMongo
  - Groq API (AI)
  - WeatherAPI.com

- **Database:**
  - MongoDB Atlas

## 📝 Environment Variables

### Python Backend (`python_ai/.env`)

```env
MONGODB_URI=your_mongodb_connection_string
WEATHER_API_KEY=your_weatherapi_key
GROQ_API_KEY=your_groq_api_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- AI powered by [Groq](https://groq.com/)
- 3D animations by [Spline](https://spline.design/)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for smart agriculture
