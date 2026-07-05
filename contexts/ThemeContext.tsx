import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes, space, radius, ThemeColors } from '../theme';

type Mode = 'light' | 'dark';

type ThemeContextValue = {
  mode: Mode;
  colors: ThemeColors;
  space: typeof space;
  radius: number;
  toggle: () => void;
};

const STORAGE_KEY = 'mulvane.themeMode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<Mode>(systemScheme === 'dark' ? 'dark' : 'light');

  // On first launch, adopt whatever the user explicitly chose last time,
  // overriding the system-scheme default above.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark') setMode(saved);
    });
  }, []);

  const toggle = () => {
    setMode((prev) => {
      const next: Mode = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, colors: palettes[mode], space, radius, toggle }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
