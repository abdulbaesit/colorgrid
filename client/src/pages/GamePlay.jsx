import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

const GamePlay = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();
    const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const socketRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        // Initialize socket connection
        socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
            withCredentials: true,
            auth: {
                token: localStorage.getItem('token')
            },
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true
        });

        // Join game room
        if (user && gameId) {
            console.log('Joining game room:', gameId);
            socketRef.current.emit('join_game', gameId);
        }

        // Listen for move made
        socketRef.current.on('move_made', ({ grid, currentTurn, lastMove }) => {
            if (isMounted) {
                console.log('Move made:', { grid, currentTurn, lastMove });
                setGame(prev => ({
                    ...prev,
                    grid: grid.map(row => [...row]), // Ensure deep copy of grid
                    currentTurn,
                    lastMove
                }));
            }
        });

        // Listen for game start
        socketRef.current.on('game_start', (gameData) => {
            if (isMounted) {
                console.log('Game started:', gameData);
                setGame(gameData);
                setLoading(false);
            }
        });

        // Listen for game end
        socketRef.current.on('game_end', ({ grid, winner, result, player1Area, player2Area, message }) => {
            if (isMounted) {
                console.log('Game ended:', { grid, winner, result, player1Area, player2Area, message });
                setGame(prev => ({
                    ...prev,
                    grid: grid.map(row => [...row]), // Ensure deep copy of grid
                    status: 'completed',
                    winner,
                    result,
                    player1Area,
                    player2Area,
                    endMessage: message[user._id] // Get message specific to current player
                }));
            }
        });

        // Listen for game over (forfeit)
        socketRef.current.on('game_over_forfeit', ({ gameId, winner, forfeit, forfeiter, result, message }) => {
            if (isMounted) {
                console.log('Game over by forfeit:', { gameId, winner, forfeit, forfeiter, result, message });
                setGame(prev => ({
                    ...prev,
                    status: 'completed',
                    winner,
                    result,
                    forfeit: true,
                    forfeiter: forfeiter,
                    endMessage: message[user._id] // Get message specific to current player
                }));
            }
        });

        // Listen for regular game over (keep for backward compatibility)
        socketRef.current.on('game_over', ({ winner, forfeit, result, message }) => {
            if (isMounted) {
                console.log('Game over:', { winner, forfeit, result, message });
                setGame(prev => ({
                    ...prev,
                    status: 'completed',
                    winner,
                    result,
                    forfeit: forfeit || false,
                    endMessage: message[user._id] // Get message specific to current player
                }));
            }
        });

        // Initial game fetch
        const fetchGame = async () => {
            try {
                const response = await axios.get(`/api/games/${gameId}`);
                if (isMounted) {
                    console.log('Initial game state:', response.data);
                    const gameData = response.data;

                    // If it's a completed forfeit game, generate the appropriate message
                    if (gameData.status === 'completed' && gameData.forfeit) {
                        const isForfeiter = gameData.forfeiter && user && gameData.forfeiter.toString() === user._id;
                        gameData.endMessage = isForfeiter
                            ? "You forfeited the game!"
                            : "You won because your opponent forfeited!";
                    }

                    setGame(gameData);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching game:', error);
                if (isMounted) {
                    setError('Failed to fetch game. Please try again.');
                    setLoading(false);
                }
            }
        };

        fetchGame();

        // Cleanup
        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [gameId, user]);

    useEffect(() => {
        if (game && game.status === 'completed') {
            axios.get('/api/users/profile').then(res => {
                if (updateProfile) updateProfile(res.data.username, undefined, res.data.profilePicture);
            }).catch(error => {
                console.error('Failed to fetch updated profile:', error);
            });
        }
    }, [game && game.status]);

    const makeMove = (row, col) => {
        if (!game || game.status !== 'in_progress' || game.currentTurn.toString() !== user._id) {
            console.log('Cannot make move:', {
                gameExists: !!game,
                gameStatus: game?.status,
                isCurrentTurn: game?.currentTurn.toString() === user._id
            });
            return;
        }

        console.log('Making move:', { row, col, gameId });
        socketRef.current.emit('make_move', { gameId, row, col });
    };

    const forfeitGame = () => {
        if (window.confirm('Are you sure you want to forfeit the game?')) {
            socketRef.current.emit('forfeit_game', { gameId });
        }
    };

    // Helper to get status message
    const getStatusMessage = () => {
        if (game.status === 'in_progress') {
            return isCurrentTurn ? 'Status: Your Turn' : 'Status: Opponent Turn';
        } else if (game.status === 'completed') {
            // For forfeit cases, use simplified status
            if (game.forfeit) {
                const isForfeiter = game.forfeiter && user && game.forfeiter.toString() === user._id;
                return isForfeiter
                    ? 'Status: You Forfeited'
                    : 'Status: You Won (Opponent Forfeited)';
            }

            // Use custom end message if available (for regular game completion)
            if (game.endMessage && !game.forfeit) {
                return `Status: ${game.endMessage}`;
            }

            // Fallback to generic win/loss messages for regular games
            if (game.result === 'draw') {
                return 'Status: Draw';
            } else if (game.winner && user && game.winner.toString() === user._id) {
                return 'Status: You Won (+200 coins)';
            } else if (user && user.coins === 0) {
                return 'Status: You Lost';
            } else {
                return 'Status: You Lost (-200 coins)';
            }
        }
        return '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
                </div>
                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
                        <p className="mt-4 text-xl text-white">Loading game...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
                </div>
                <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
                        <div className="text-red-600 dark:text-red-400 text-xl mb-4">{error}</div>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!game) {
        return null;
    }

    const isPlayer1 = game.player1._id === user._id;
    const isPlayer2 = game.player2._id === user._id;
    const isCurrentTurn = game.currentTurn.toString() === user._id;
    const playerColor = isPlayer1 ? game.player1Color : game.player2Color;
    const opponentColor = isPlayer1 ? game.player2Color : game.player1Color;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
                        {/* Game Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Game #{gameId.slice(-4)}</h1>
                            {game.status === 'in_progress' && (
                                <button
                                    onClick={forfeitGame}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    Forfeit Game
                                </button>
                            )}
                        </div>

                        {/* Player Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-lg p-6 backdrop-blur-sm">
                                <div className="flex items-center space-x-4 mb-4">
                                    {game.player1.profilePicture &&
                                        game.player1.profilePicture !== '' &&
                                        !game.player1.profilePicture.includes('placeholder') &&
                                        !game.player1.profilePicture.includes('placehold') ? (
                                        <img
                                            src={game.player1.profilePicture}
                                            alt={game.player1.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {game.player1.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.player1.username}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Color: <span style={{ color: game.player1Color }}>{game.player1Color}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-lg p-6 backdrop-blur-sm">
                                <div className="flex items-center space-x-4 mb-4">
                                    {game.player2.profilePicture &&
                                        game.player2.profilePicture !== '' &&
                                        !game.player2.profilePicture.includes('placeholder') &&
                                        !game.player2.profilePicture.includes('placehold') ? (
                                        <img
                                            src={game.player2.profilePicture}
                                            alt={game.player2.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {game.player2.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.player2.username}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Color: <span style={{ color: game.player2Color }}>{game.player2Color}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Game Status */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Game Status</h2>
                            {game.status === 'in_progress' ? (
                                <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-lg p-6 backdrop-blur-sm">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {isCurrentTurn ? "It's your turn!" : "Waiting for opponent's move..."}
                                    </p>
                                    {game.lastMove && (
                                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                                            Last move: {game.lastMove.color} at position ({game.lastMove.row + 1}, {game.lastMove.col + 1})
                                        </p>
                                    )}
                                </div>
                            ) : game.status === 'completed' ? (
                                <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-lg p-6 backdrop-blur-sm">
                                    <p className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                    {game.forfeit
                                        ? "Game Over - Forfeit"
                                        : game.result === 'draw'
                                            ? "It's a draw!"
                                            : game.winner && user && game.winner.toString() === user._id
                                                ? '🎉 Congratulations! You won! 🎉'
                                                : 'Game Over! You lost!'}
                                </p>
                                <p className="text-lg text-gray-900 dark:text-white mb-2">
                                    {game.endMessage}
                                </p>
                                {!game.forfeit && game.player1Area !== undefined && game.player2Area !== undefined && (
                                    <div className="text-md text-gray-600 dark:text-gray-300 space-y-1">
                                        <p>Player 1 Area: {game.player1Area} cells</p>
                                        <p>Player 2 Area: {game.player2Area} cells</p>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Game Board */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Game Board</h2>
                        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto mb-6">
                            {game.grid.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => makeMove(rowIndex, colIndex)}
                                        disabled={!isCurrentTurn || game.status !== 'in_progress'}
                                        className={`aspect-square rounded-lg border-2 border-gray-200 transition-all duration-300 ${!isCurrentTurn || game.status !== 'in_progress'
                                            ? 'cursor-not-allowed'
                                            : 'cursor-pointer hover:scale-105'
                                            } ${game.lastMove &&
                                                game.lastMove.row === rowIndex &&
                                                game.lastMove.col === colIndex
                                                ? 'ring-4 ring-yellow-400'
                                                : ''
                                            }`}
                                        style={{
                                            backgroundColor: cell || 'white',
                                            transform: game.lastMove &&
                                                game.lastMove.row === rowIndex &&
                                                game.lastMove.col === colIndex
                                                ? 'scale(1.05)'
                                                : 'scale(1)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Current Turn Status */}
                    <div className="text-center mb-8">
                        <span className="inline-block px-4 py-2 rounded-lg text-lg font-semibold bg-blue-100/80 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 backdrop-blur-sm">
                            {getStatusMessage()}
                        </span>
                    </div>

                    {/* Game Actions */}
                    {game.status === 'completed' && (
                        <div className="text-center">
                            <button
                                onClick={() => navigate('/newgame/waiting')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePlay; 