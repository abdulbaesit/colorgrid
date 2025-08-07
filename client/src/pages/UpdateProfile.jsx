import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UpdateProfile() {
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, updateUser, updateProfile } = useAuth();

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setProfilePicture(user.profilePicture || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Validate passwords if changing
            if (newPassword) {
                if (newPassword.length < 6) {
                    throw new Error('New password must be at least 6 characters long');
                }
                if (newPassword !== confirmPassword) {
                    throw new Error('New passwords do not match');
                }
                if (!currentPassword) {
                    throw new Error('Current password is required to set a new password');
                }
            }

            const response = await axios.put('/api/users/profile', {
                username,
                profilePicture,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined
            });

            await updateProfile(username, newPassword || undefined, profilePicture || undefined);
            setSuccess('Profile updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-r from-cyan-300 to-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 min-h-screen py-8 px-4 flex flex-col items-center justify-center">
                <div className="max-w-2xl mx-auto w-full">
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl shadow-lg">
                            <span className="text-xl">👤</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                            Update Profile
                        </h1>
                    </div>

                    <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 md:p-8">
                        {error && (
                            <div className="bg-red-500/20 border border-red-400/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-500/20 border border-green-400/50 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                                    required
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                    Profile Picture URL
                                </label>
                                <input
                                    type="url"
                                    id="profilePicture"
                                    value={profilePicture}
                                    onChange={(e) => setProfilePicture(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                                    placeholder="https://example.com/profile.jpg"
                                />
                            </div>

                            <div className="border-t border-white/30 dark:border-gray-700/30 pt-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg mr-2 flex items-center justify-center">
                                        <span className="text-white text-xs">🔐</span>
                                    </div>
                                    Change Password
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                                            placeholder="Enter current password"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/home')}
                                    className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition duration-300 backdrop-blur-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProfile; 