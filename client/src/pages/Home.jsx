import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 px-4">
                <div className="w-full max-w-4xl mx-auto">
                    {/* Header Card */}
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 md:p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-6 mb-6 md:mb-0">
                                {/* ColorGrid Logo */}
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl shadow-lg">
                                    <div className="grid grid-cols-2 gap-1 w-8 h-8">
                                        <div className="bg-red-400 rounded-sm"></div>
                                        <div className="bg-blue-400 rounded-sm"></div>
                                        <div className="bg-yellow-400 rounded-sm"></div>
                                        <div className="bg-green-400 rounded-sm"></div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight">
                                        ColorGrid
                                    </h1>
                                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
                                        {user?.profilePicture &&
                                            user.profilePicture !== '' &&
                                            !user.profilePicture.includes('placeholder') &&
                                            !user.profilePicture.includes('placehold') ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={user?.username}
                                                className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user?.username}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg">
                                    <span className="text-sm font-medium text-yellow-900">Your Coins</span>
                                    <div className="text-2xl font-bold text-yellow-900 flex items-center justify-center mt-1">
                                        💰 {user?.coins || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <button
                            onClick={() => navigate('/newgame/waiting')}
                            className="group relative overflow-hidden backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 hover:scale-105 transform transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl shadow-lg mb-4 flex items-center justify-center">
                                    <span className="text-2xl">🎮</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Play Game</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Start a new game and challenge other players</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="group relative overflow-hidden backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 hover:scale-105 transform transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg mb-4 flex items-center justify-center">
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Leaderboard</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">See top players and their achievements</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/history')}
                            className="group relative overflow-hidden backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 hover:scale-105 transform transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl shadow-lg mb-4 flex items-center justify-center">
                                    <span className="text-2xl">📜</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Game History</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Review your past games and results</p>
                            </div>
                        </button>
                    </div>

                    {/* How to Play Card */}
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg mr-3 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">?</span>
                            </div>
                            How to Play
                        </h2>
                        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-3 text-base">
                            <li><span className="font-semibold text-emerald-600 dark:text-emerald-400">Click Play Game</span> to start matchmaking</li>
                            <li>You'll be matched with another player</li>
                            <li>Take turns coloring the 5x5 grid</li>
                            <li>Win by having the largest connected area of your color</li>
                            <li>Earn coins for winning games!</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home; 