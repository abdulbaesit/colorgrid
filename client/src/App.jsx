import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
// import Home from './pages/Dashboard';
import GameWaiting from './pages/GameWaiting';
import GamePlay from './pages/GamePlay';
import GameHistory from './pages/GameHistory';
import GameHistoryDetail from './pages/GameHistoryDetail';
import UpdateProfile from './pages/UpdateProfile';
import Leaderboard from './pages/Leaderboard';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/home"
                        // path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/newgame/waiting"
                        element={
                            <ProtectedRoute>
                                <GameWaiting />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/newgame/:gameId"
                        element={
                            <ProtectedRoute>
                                <GamePlay />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <GameHistory />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/history/:gameId"
                        element={
                            <ProtectedRoute>
                                <GameHistoryDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/update-profile"
                        element={
                            <ProtectedRoute>
                                <UpdateProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/leaderboard"
                        element={
                            <ProtectedRoute>
                                <Leaderboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App; 