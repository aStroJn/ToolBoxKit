import { useContext } from 'react';
import { ThemeContext } from '../context/createThemeContext';

/**
 * Hook for accessing theme context
 * Must be used within a ThemeProvider
 */
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
