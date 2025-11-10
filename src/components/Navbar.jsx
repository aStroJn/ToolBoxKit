import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Centered Logo */}
          <div className="flex-1 flex items-center justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl">🧰</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ToolBoxKit
              </h1>
            </Link>
          </div>

          {/* Right: Dark mode toggle (absolutely positioned 10px from right) */}
          <div className="absolute right-[10px]">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <span className="text-yellow-400">☀️</span>
              ) : (
                <span className="text-gray-700">🌙</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;