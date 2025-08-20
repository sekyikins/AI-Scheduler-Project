import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
        secondary: mode === 'light' ? '#475569' : '#cbd5e1',
      },
      success: { main: '#10b981', light: '#34d399', dark: '#059669' },
      warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
      error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
      info: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.75rem' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 600, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1.125rem' },
      body1: { fontSize: '1rem', lineHeight: 1.6 },
      body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: mode === 'light'
              ? 'radial-gradient(1200px 600px at 100% -100px, rgba(99,102,241,0.12), rgba(245,158,11,0) 60%), radial-gradient(1000px 500px at -200px 120%, rgba(245,158,11,0.1), rgba(99,102,241,0) 60%)'
              : 'radial-gradient(1200px 600px at 100% -100px, rgba(99,102,241,0.2), rgba(245,158,11,0) 60%), radial-gradient(1000px 500px at -200px 120%, rgba(245,158,11,0.16), rgba(99,102,241,0) 60%)',
            backgroundAttachment: 'fixed',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: mode === 'light'
              ? 'linear-gradient(90deg, rgba(99,102,241,0.08), rgba(245,158,11,0.08))'
              : 'linear-gradient(90deg, rgba(99,102,241,0.12), rgba(245,158,11,0.12))'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
            border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
            backgroundImage: mode === 'light'
              ? 'linear-gradient(180deg, rgba(99,102,241,0.08), rgba(245,158,11,0.08))'
              : 'linear-gradient(180deg, rgba(99,102,241,0.12), rgba(245,158,11,0.12))',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' ? '0 10px 18px rgba(0,0,0,0.12)' : '0 10px 18px rgba(0,0,0,0.35)'
            }
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
            border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
            backgroundImage: mode === 'light'
              ? 'linear-gradient(180deg, rgba(99,102,241,0.04), rgba(245,158,11,0.04))'
              : 'linear-gradient(180deg, rgba(99,102,241,0.08), rgba(245,158,11,0.08))',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, padding: '8px 16px' },
          containedPrimary: {
            backgroundImage: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            '&:hover': { backgroundImage: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }
          }
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 500, borderRadius: 6 } } },
      MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4 } } },
    },
  });

  const contextValue: ThemeContextType = { mode, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}; 