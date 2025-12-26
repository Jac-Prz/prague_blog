"use client";
import { useState } from "react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          console.log('Menu clicked, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="md:hidden flex flex-col gap-1 p-2 -mr-1.5 relative z-50"
        aria-label="Toggle menu"
        type="button"
        style={{ color: 'var(--foreground)' }}
      >
        <span className="w-5 h-0.5 transition-all" style={{ backgroundColor: 'currentColor' }} />
        <span className="w-5 h-0.5 transition-all" style={{ backgroundColor: 'currentColor' }} />
        <span className="w-5 h-0.5 transition-all" style={{ backgroundColor: 'currentColor' }} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90] md:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed top-0 right-0 bottom-0 z-[100] w-[min(80vw,16rem)] md:hidden shadow-2xl"
            style={{
              backgroundColor: '#fdfcfb',
              borderLeft: '1px solid #e8e3df'
            }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-2xl leading-none"
                aria-label="Close menu"
                type="button"
                style={{ color: 'var(--foreground)' }}
              >
                ×
              </button>
            </div>
            <nav className="flex flex-col gap-7 px-6 py-4">
              <a
                href="/eat-drink"
                style={{ color: 'var(--foreground)' }}
                className="text-base font-medium hover:opacity-70 transition-opacity"
                onClick={() => setIsOpen(false)}
              >
                Eat & Drink
              </a>
              <a
                href="/neighborhoods"
                style={{ color: 'var(--foreground)' }}
                className="text-base hover:opacity-70 transition-opacity"
                onClick={() => setIsOpen(false)}
              >
                Neighborhoods
              </a>
              <a
                href="/things-to-do"
                style={{ color: 'var(--foreground)' }}
                className="text-base hover:opacity-70 transition-opacity"
                onClick={() => setIsOpen(false)}
              >
                Things to Do
              </a>
              <a
                href="/practical-tips"
                style={{ color: 'var(--foreground)' }}
                className="text-base hover:opacity-70 transition-opacity"
                onClick={() => setIsOpen(false)}
              >
                Practical Tips
              </a>
              <a
                href="/articles"
                style={{ color: 'var(--muted)', opacity: 0.75 }}
                className="text-base hover:opacity-70 transition-opacity pt-4 border-t"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)', opacity: 0.75 }}
                onClick={() => setIsOpen(false)}
              >
                All Articles
              </a>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
