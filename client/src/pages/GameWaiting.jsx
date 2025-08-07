import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const GameWaiting = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('searching');
    const [gameId, setGameId] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const socketRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        // Initialize socket connection with authentication
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            setStatus('error');
            return;
        }

        console.log('Initializing socket connection with token:', token ? 'Token present' : 'No token');

        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
            withCredentials: true,
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            forceNew: true
        });

        // Connection event handlers
        socketRef.current.on('connect', () => {
            console.log('Socket connected, starting matchmaking...');
            // Start matchmaking when connected
            socketRef.current.emit('find_match');
            setStatus('searching');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            if (isMounted) {
                setStatus('error');
            }
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            if (isMounted) {
                setStatus('error');
            }
        });

        // Listen for match found event
        socketRef.current.on('match_found', ({ gameId, opponent }) => {
            if (isMounted) {
                console.log('Match found:', { gameId, opponent });
                setStatus('matched');
                setOpponent(opponent);
                setGameId(gameId);
                // After a short delay, redirect to the game
                setTimeout(() => {
                    navigate(`/newgame/${gameId}`);
                }, 2000);
            }
        });

        // Listen for game start event
        socketRef.current.on('game_start', ({ gameId, grid, currentTurn }) => {
            if (isMounted) {
                console.log('Game starting:', { gameId, grid, currentTurn });
                navigate(`/newgame/${gameId}`);
            }
        });

        // Cleanup function
        return () => {
            isMounted = false;
            if (socketRef.current) {
                console.log('Cleaning up socket connection...');
                socketRef.current.emit('cancel_matchmaking');
                socketRef.current.disconnect();
            }
        };
    }, [navigate, user]);

    const handleCancel = () => {
        if (status === 'searching') {
            socketRef.current.emit('cancel_matchmaking');
            navigate('/home');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
                <div className="max-w-2xl w-full mx-auto text-center">
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
                        {status === 'searching' && (
                            <>
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl shadow-lg mb-6">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                                    Finding an opponent...
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
                                    Please wait while we match you with another player
                                </p>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    Cancel Search
                                </button>
                            </>
                        )}

                        {status === 'matched' && opponent && (
                            <>
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl shadow-lg mb-6">
                                    <span className="text-3xl">🎮</span>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                                    Opponent Found!
                                </h2>
                                <div className="mb-6">
                                    {opponent.profilePicture &&
                                        opponent.profilePicture !== '' &&
                                        !opponent.profilePicture.includes('placeholder') &&
                                        !opponent.profilePicture.includes('placehold') ? (
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-400 shadow-lg mb-4 overflow-hidden">
                                            <img
                                                src={opponent.profilePicture}
                                                alt={opponent.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-400 shadow-lg mb-4 bg-gradient-to-br from-emerald-400 to-cyan-400">
                                            <span className="text-white font-bold text-2xl">
                                                {opponent.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{opponent.username}</p>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                                    Redirecting to game...
                                </p>
                                <button
                                    className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed opacity-50"
                                    disabled
                                >
                                    Please Wait...
                                </button>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl shadow-lg mb-6">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                    Matchmaking Failed
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
                                    There was an error finding an opponent. Please try again.
                                </p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    Return to Home
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameWaiting; 