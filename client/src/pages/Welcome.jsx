import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Welcome() {
    const { isDemoMode } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
            {/* Demo notice banner */}
            {isDemoMode && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 text-center text-sm font-medium z-50">
                    🚀 Demo Mode: Frontend-only showcase. Full multiplayer features require backend deployment.
                </div>
            )}

            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <div className={`relative z-10 min-h-screen flex items-center justify-center px-4 py-8 ${isDemoMode ? 'pt-16' : ''}`}>
                <div className="max-w-2xl w-full mx-auto text-center">
                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 md:p-8">
                        {/* Game icon/logo area */}
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl shadow-lg mb-4">
                                <div className="grid grid-cols-2 gap-1 w-8 h-8 md:w-10 md:h-10">
                                    <div className="bg-red-400 rounded-sm"></div>
                                    <div className="bg-blue-400 rounded-sm"></div>
                                    <div className="bg-yellow-400 rounded-sm"></div>
                                    <div className="bg-green-400 rounded-sm"></div>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
                            ColorGrid
                        </h1>

                        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                            Strategic Multiplayer Puzzle Gaming
                        </h2>

                        <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                            Dive into the exciting world of ColorGrid - a strategic multiplayer puzzle game where quick thinking meets tactical gameplay!
                            Challenge your friends or compete against players worldwide as you race to fill grids with colors and claim victory.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">⚡</span>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Real-time</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300">Live multiplayer action</p>
                            </div>
                            <div className="p-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">🏆</span>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Leaderboards</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300">Global competition</p>
                            </div>
                            <div className="p-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">🎯</span>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">Strategic</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-300">Tactical gameplay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome; 