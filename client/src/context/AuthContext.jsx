import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Check if we're in demo mode (GitHub Pages without backend)
const isDemoMode = !import.meta.env.VITE_API_URL && window.location.hostname === 'abdulbaesit.github.io';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isDemoMode) {
            // In demo mode, skip API calls and set loading to false immediately
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isDemoMode) return; // Skip socket connection in demo mode

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
            withCredentials: true,
            auth: { token: localStorage.getItem('token') }
        });
        socket.on('update_coins', async () => {
            try {
                const res = await axios.get('/api/users/me');
                setUser(res.data);
            } catch (err) {
                console.error('Failed to update coins:', err);
            }
        });
        return () => socket.disconnect();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        if (isDemoMode) {
            // In demo mode, simulate a successful login
            const demoUser = {
                id: 1,
                username: username,
                coins: 100,
                profilePicture: '👤',
                gamesPlayed: 0,
                gamesWon: 0
            };
            setUser(demoUser);
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
            return { success: true };
        }

        try {
            const response = await axios.post('/api/users/login', {
                username,
                password
            });

            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (username, password, profilePicture) => {
        if (isDemoMode) {
            // In demo mode, simulate a successful registration
            const demoUser = {
                id: 1,
                username: username,
                coins: 100,
                profilePicture: profilePicture || '👤',
                gamesPlayed: 0,
                gamesWon: 0
            };
            setUser(demoUser);
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
            return { success: true };
        }

        try {
            const response = await axios.post('/api/users/register', {
                username,
                password,
                profilePicture
            });

            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        if (isDemoMode) {
            localStorage.removeItem('demoUser');
            setUser(null);
            return;
        }

        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateProfile = async (username, password, profilePicture) => {
        if (isDemoMode) {
            // In demo mode, update the demo user
            const updatedUser = { ...user, username, profilePicture };
            setUser(updatedUser);
            localStorage.setItem('demoUser', JSON.stringify(updatedUser));
            return { success: true };
        }

        try {
            const response = await axios.put('/api/users/profile', {
                username,
                password,
                profilePicture
            });

            const { token, ...userData } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    // Load demo user on initial load if in demo mode
    useEffect(() => {
        if (isDemoMode) {
            const demoUser = localStorage.getItem('demoUser');
            if (demoUser) {
                setUser(JSON.parse(demoUser));
            }
        }
    }, []);

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isDemoMode
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 