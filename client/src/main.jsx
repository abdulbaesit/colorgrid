import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DarkModeProvider } from './context/DarkModeContext';
import { useDarkMode } from './context/DarkModeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <DarkModeProvider>
            <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                <App />
            </div>
        </DarkModeProvider>
    </React.StrictMode>
);

function DarkModeToggle() {
    const { dark, setDark } = useDarkMode();
    return (
        <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
            aria-label="Toggle dark mode"
        >
            {dark ? '🌙' : '☀️'}
        </button>
    );
}

export default DarkModeToggle; 