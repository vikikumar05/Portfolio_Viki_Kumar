import { useEffect, useState } from 'react';
export default function useTheme() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; } });
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('theme', theme); } catch {} }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}
