// src/hooks/useSystemTheme.js
import { useState, useEffect } from 'react';

export const useSystemTheme = () => {
  // Check the browser's theme settings immediately on load
  const [theme, setTheme] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listener to update state dynamically if the user switches system modes
    const handleChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Attach listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup on unmount
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return theme;
};