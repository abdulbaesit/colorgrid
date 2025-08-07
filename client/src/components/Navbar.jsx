import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/home" className="flex items-center space-x-3">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg shadow-lg">
                                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                                    <div className="bg-red-400 rounded-sm"></div>
                                    <div className="bg-blue-400 rounded-sm"></div>
                                    <div className="bg-yellow-400 rounded-sm"></div>
                                    <div className="bg-green-400 rounded-sm"></div>
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">ColorGrid</span>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <DarkModeToggle />
                        <div className="flex items-center space-x-4 ml-4">
                            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md">
                                <span className="text-sm font-semibold text-yellow-900">
                                    💰 {user?.coins || 0}
                                </span>
                            </div>
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 focus:outline-none p-2 rounded-lg hover:bg-white/20 bg-transparent dark:bg-gray-800/50 dark:hover:bg-gray-800/70 transition-colors duration-200"
                                >
                                    {user?.profilePicture &&
                                        user.profilePicture !== '' &&
                                        !user.profilePicture.includes('placeholder') &&
                                        !user.profilePicture.includes('placehold') ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user?.username}
                                            className="w-10 h-10 rounded-full border-2 border-emerald-400 shadow-md object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full border-2 border-emerald-400 shadow-md bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">{user?.username}</span>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl border border-white/50 dark:border-gray-700/50 py-2 z-50">
                                        <Link
                                            to="/update-profile"
                                            className="block px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/20 transition-colors duration-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Update Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hover:bg-red-500/20 dark:hover:bg-red-500/20 transition-colors duration-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
