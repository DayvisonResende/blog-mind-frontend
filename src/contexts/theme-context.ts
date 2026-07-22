import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Chave usada para persistir a preferencia de tema no localStorage. */
export const THEME_STORAGE_KEY = 'blog-mind-theme';
