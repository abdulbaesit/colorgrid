import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function GameHistory() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await axios.get('/api/games/history');
            setGames(response.data);
            console.log('Raw games data:', response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
            setError('Failed to load game history');
        } finally {
            setLoading(false);
        }
    };

    const getResultText = (game) => {
        if (!game.result) return 'In Progress';
        if (game.result === 'draw') return 'Draw';
        if (game.winner?._id && user?._id) {
            return game.winner._id === user._id ? 'Won' : 'Lost';
        }
        return game.winner?.username === user?.username ? 'Won' : 'Lost';
    };

    const getOpponent = (game) => {
        if (!user?._id) return { username: 'Opponent', profilePicture: '' };

        if (game.player1 && game.player1._id !== user._id) {
            return game.player1;
        }
        if (game.player2 && game.player2._id !== user._id) {
            return game.player2;
        }
        return { username: 'Opponent', profilePicture: '' };
    };

    // Sort games by creation date ascending (oldest first)
    const sortedGames = [...games].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Filter games where the current user is a player
    const filteredGames = sortedGames.filter(game => {
        const isValid = game.player1 &&
            game.player2 &&
            typeof game.player1 === 'object' &&
            typeof game.player2 === 'object' &&
            game.player1._id &&
            game.player2._id &&
            user?._id &&
            (game.player1._id === user._id || game.player2._id === user._id) &&
            game.player1._id !== game.player2._id;

        if (!isValid) {
            console.log('Game filtered out:', {
                gameId: game._id,
                player1: game.player1,
                player2: game.player2,
                currentUserId: user?._id,
                reason: !game.player1 ? 'No player1' :
                    !game.player2 ? 'No player2' :
                        typeof game.player1 !== 'object' ? 'player1 not object' :
                            typeof game.player2 !== 'object' ? 'player2 not object' :
                                !game.player1._id ? 'No player1._id' :
                                    !game.player2._id ? 'No player2._id' :
                                        !user?._id ? 'No current user' :
                                            !(game.player1._id === user._id || game.player2._id === user._id) ? 'Current user not in game' :
                                                game.player1._id === game.player2._id ? 'Same player' : 'Unknown'
            });
        }
        return isValid;
    });

    console.log('Filtered games:', filteredGames);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
                </div>
                <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl shadow-lg mb-6">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                        </div>
                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading game history...</p>
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
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8 text-center">
                        <div className="bg-red-500/20 border border-red-400/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                            {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 md:p-8">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl shadow-lg">
                                <span className="text-xl">📜</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                Game History
                            </h1>
                        </div>

                        {filteredGames.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl shadow-lg mb-6">
                                    <span className="text-3xl">🎮</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-lg">
                                    No games found. Start playing to build your game history!
                                </p>
                                <Link
                                    to="/home"
                                    className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    Play a Game
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Match</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Opponent</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Result</th>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/20 dark:divide-gray-700/30">
                                        {filteredGames.map((game, index) => (
                                            <tr key={game._id} className="hover:bg-white/10 dark:hover:bg-gray-800/20 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        to={`/history/${game._id}`}
                                                        className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
                                                    >
                                                        Game #{index + 1}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        {getOpponent(game).profilePicture &&
                                                            getOpponent(game).profilePicture !== '' &&
                                                            !getOpponent(game).profilePicture.includes('placeholder') &&
                                                            !getOpponent(game).profilePicture.includes('placehold') ? (
                                                            <img
                                                                src={getOpponent(game).profilePicture}
                                                                alt={getOpponent(game).username}
                                                                className="w-10 h-10 rounded-full border-2 border-emerald-400 shadow-md object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 shadow-md bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                                                <span className="text-white font-bold text-xs">
                                                                    {getOpponent(game).username?.charAt(0)?.toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span className="text-gray-800 dark:text-gray-200 font-medium">{getOpponent(game).username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${game.result === 'draw'
                                                        ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30'
                                                        : getResultText(game) === 'Won'
                                                            ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30'
                                                            : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                                                        }`}>
                                                        {getResultText(game) === 'Won' && '🏆'}
                                                        {getResultText(game) === 'Lost' && '💀'}
                                                        {getResultText(game) === 'Draw' && '🤝'}
                                                        <span className="ml-1">{getResultText(game)}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-medium">
                                                    {new Date(game.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameHistory; 