import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex justify-center items-center">
            
          </div>

          <div className="flex-shrink-0 flex justify-center items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              <a href='/'>ToolsBoxKit</a>
            </h1>
          </div>

          {/* Dark Mode Toggle */}
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
    </nav>
  );
};

export default Navbar;