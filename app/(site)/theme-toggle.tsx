"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Always start fresh - check localStorage for explicit dark mode preference
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    
    setTheme(isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full" style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)'
      }} />
    );
  }

  return (
    <button
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 active:scale-95"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        color: 'var(--foreground)',
        outlineColor: 'var(--accent)'
      }}
    >
      {theme === "light" ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto" style={{ color: 'var(--muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto" style={{ color: 'var(--muted)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}
