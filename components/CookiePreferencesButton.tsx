'use client';

export default function CookiePreferencesButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).Cookiebot) {
      (window as any).Cookiebot.show();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-[0.875rem] hover:opacity-70 transition-opacity"
      style={{ color: 'var(--accent)' }}
    >
      Cookie Preferences
    </button>
  );
}
