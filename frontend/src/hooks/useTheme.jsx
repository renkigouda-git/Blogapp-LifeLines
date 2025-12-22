import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext(null);

/** Final list of supported themes (strings only) */
export const THEMES = [
  'paper', 'ember', 'royal',
  'rainbow', 'rainbow-light',
  'neon', 'citrus', 'pastel',
  'dark', // keep dark as fallback
];

/** choose initial theme: saved → system → paper */
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved && THEMES.includes(saved)) return saved;
  } catch {}
  const prefersDark = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'paper';
}

function applyTheme(theme) {
  const html = document?.documentElement;
  if (!html) return;

  // remove all known theme-* classes, add the current one
  THEMES.forEach(t => html.classList.remove('theme-' + t));
  html.classList.add('theme-' + theme);

  // convenience hook in CSS if needed
  html.setAttribute('data-theme', theme);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, THEMES }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
