import { useDarkMode } from '../context/DarkModeContext';

function DarkModeToggle() {
    const { theme, setTheme } = useDarkMode();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`relative flex items-center w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${isDark ? 'bg-gray-800' : 'bg-yellow-300'}`}
            aria-label="Toggle dark mode"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className="absolute left-1 top-1 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-300 bg-white shadow-md"
                style={{ transform: isDark ? 'translateX(32px)' : 'translateX(0)' }}
            >
                {isDark ? (
                    <span className="text-gray-800 text-xl">🌙</span>
                ) : (
                    <span className="text-yellow-400 text-xl">☀️</span>
                )}
            </span>
            {/* Sun and moon background icons for visual context */}
            <span className="absolute left-3 text-yellow-500 text-lg transition-opacity duration-300" style={{ opacity: isDark ? 0 : 1 }}>☀️</span>
            <span className="absolute right-3 text-gray-300 text-lg transition-opacity duration-300" style={{ opacity: isDark ? 1 : 0 }}>🌙</span>
        </button>
    );
}

export default DarkModeToggle;
