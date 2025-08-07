import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate('/home');
        // navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error: invalid login');
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="backdrop-blur-lg bg-white/20 dark:bg-gray-900/20 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-6 md:p-8">
            {/* Game icon */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl shadow-lg">
                <div className="grid grid-cols-2 gap-1 w-8 h-8">
                  <div className="bg-red-400 rounded-sm"></div>
                  <div className="bg-blue-400 rounded-sm"></div>
                  <div className="bg-yellow-400 rounded-sm"></div>
                  <div className="bg-green-400 rounded-sm"></div>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-8">
              Login to ColorGrid
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                {error}
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
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition duration-300 backdrop-blur-sm text-gray-900 dark:text-gray-100"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 font-semibold transition duration-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 