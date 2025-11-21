'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start with 'dark' to match server render
  // The script tag sets the correct theme before hydration
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Sync theme from document attribute (set by script) on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const docTheme = document.documentElement.getAttribute('data-theme') as Theme | null;
      if (docTheme === 'light' || docTheme === 'dark') {
        setThemeState(docTheme);
      } else {
        // Fallback to localStorage if attribute not set
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
          document.documentElement.setAttribute('data-theme', savedTheme);
        }
      }
      setMounted(true);
    }
  }, []);

  // Apply theme to document and localStorage when theme changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

