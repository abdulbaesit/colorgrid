import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/users/leaderboard');
                setPlayers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setError('Failed to load leaderboard');
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Filter and sort players
    const filteredPlayers = players
        .filter(player =>
            player.username.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => b.coins - a.coins);

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
                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading leaderboard...</p>
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
                        <div className="bg-red-500/20 border border-red-400/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                            {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                        >
                            Try Again
                        </button>
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

            <div className="relative z-10 min-h-screen py-8 px-4 flex flex-col items-center">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                Leaderboard
                            </h1>
                        </div>
                        <Link
                            to="/home"
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                        >
                            Back to Home
                        </Link>
                    </div>

                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
                        <div className="p-6">
                            <input
                                type="text"
                                placeholder="Search by username"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Player</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Wins</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Losses</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Draws</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Matches</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Coins</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20 dark:divide-gray-700/30">
                                    {filteredPlayers.map((player, index) => {
                                        const isCurrentUser = player._id === user?._id;
                                        const wins = player.stats?.wins || 0;
                                        const losses = player.stats?.losses || 0;
                                        const draws = player.stats?.draws || 0;
                                        const matches = wins + losses + draws;
                                        return (
                                            <tr
                                                key={player._id}
                                                className={`transition hover:bg-white/10 dark:hover:bg-gray-800/20 ${isCurrentUser ? 'bg-emerald-500/20 dark:bg-emerald-500/10 font-semibold border-l-4 border-emerald-400' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-800 dark:text-gray-200">
                                                    <div className="flex items-center">
                                                        {index < 3 && (
                                                            <span className="mr-2 text-xl">
                                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                                            </span>
                                                        )}
                                                        #{index + 1}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {player.profilePicture &&
                                                            player.profilePicture !== '' &&
                                                            !player.profilePicture.includes('placeholder') &&
                                                            !player.profilePicture.includes('placehold') ? (
                                                            <img
                                                                src={player.profilePicture}
                                                                alt={player.username}
                                                                className="h-12 w-12 rounded-full border-2 border-emerald-400 shadow-lg mr-4 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full border-2 border-emerald-400 shadow-lg mr-4 bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">
                                                                    {player.username?.charAt(0)?.toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="text-base font-semibold text-gray-800 dark:text-gray-200">{player.username}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-green-600 dark:text-green-400">{wins}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-red-600 dark:text-red-400">{losses}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-600 dark:text-gray-400">{draws}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800 dark:text-gray-200">{matches}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">💰</span>
                                                        <span className="text-base font-bold text-yellow-600 dark:text-yellow-400">{player.coins}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard; 