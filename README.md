# ColorGrid - Multiplayer Strategy Game 🎮

A real-time multiplayer puzzle strategy game built with React, Node.js, Express, Socket.io, and MongoDB.

## 🎯 Game Overview

ColorGrid is an exciting multiplayer strategy game where players compete to claim the largest area on a 5x5 grid. Players take turns placing colored tiles and use strategic thinking to maximize their territory while blocking opponents.

## 🚀 Features

- **Real-time Multiplayer**: Live gameplay with Socket.io
- **Strategic Gameplay**: Territorial control with area calculation
- **User Authentication**: Secure login and registration
- **Game History**: Track your past games and performance
- **Leaderboards**: Global rankings and competition
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Profile Management**: Customizable user profiles with avatars

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Socket.io Client** for real-time communication
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express
- **Socket.io** for real-time multiplayer
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
colorgrid/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── package.json
├── docs/                   # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulbaesit/colorgrid.git
   cd colorgrid
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   ```

   Create `.env` file in the client directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

5. **Run the Application**
   
   Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Game**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 🎮 How to Play

1. **Register/Login**: Create an account or log in
2. **Find Match**: Click "Play Game" to join the matchmaking queue
3. **Gameplay**: 
   - Take turns placing your colored tiles on the 5x5 grid
   - Tiles must be adjacent to your existing tiles (except the first move)
   - Goal: Control the largest area when the grid is full
4. **Win Conditions**: Player with the most territory wins
5. **Forfeit**: You can forfeit a game, but you'll lose coins

## 🏆 Game Rules

- **Grid Size**: 5x5 grid
- **Players**: 2 players per game
- **Turn System**: Alternating turns
- **Placement**: Tiles must be adjacent to existing tiles (except first move)
- **Scoring**: Area control determines the winner
- **Coins**: Win games to earn coins, lose coins when defeated
- **Forfeit**: Players can forfeit but will lose the game

## 🌐 Deployment

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### Environment Variables
Make sure to set up the following environment variables for production:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `PORT`: Server port (default: 8000)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built as part of CS 300 Advanced Programming course
- Thanks to the amazing open-source community
- Special thanks to Socket.io and React teams

## 📧 Contact

Abdul Basit - [@abdulbaesit](https://github.com/abdulbaesit)

Project Link: [https://github.com/abdulbaesit/colorgrid](https://github.com/abdulbaesit/colorgrid)

---

**Enjoy playing ColorGrid! 🎮✨**
