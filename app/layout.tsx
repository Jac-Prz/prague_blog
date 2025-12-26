import type { Metadata } from "next";
import ThemeToggle from "./theme-toggle";
import MobileNav from "./mobile-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practical Prague",
  description: "Honest advice for visiting Prague",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased overflow-x-hidden">
        <header className="sticky top-0 z-20 w-full" style={{ 
          backgroundColor: 'var(--background)',
          borderBottom: '1px solid var(--border)'
        }}>
          <nav className="mx-auto flex max-w-[52rem] items-center justify-between px-5 sm:px-6 py-3 sm:py-5">
            <a href="/" className="text-[0.8125rem] font-medium uppercase tracking-[0.12em] whitespace-nowrap hover:opacity-70 transition-opacity" style={{
              color: 'var(--muted)'
            }}>
              Practical Prague
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-5 flex-nowrap">
              {/* Primary Navigation */}
              <ul className="flex gap-5 text-[0.9375rem] whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                <li>
                  <a href="/eat-drink" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity font-medium">
                    Eat & Drink
                  </a>
                </li>
                <li>
                  <a href="/neighborhoods" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                    Neighborhoods
                  </a>
                </li>
                <li>
                  <a href="/things-to-do" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                    Things to Do
                  </a>
                </li>
                <li>
                  <a href="/practical-tips" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                    Practical Tips
                  </a>
                </li>
              </ul>
              
              {/* Secondary Navigation */}
              <div className="flex items-center gap-5 pl-5 whitespace-nowrap" style={{ borderLeft: '1px solid var(--border)' }}>
                <a href="#" style={{ color: 'var(--muted)', opacity: 0.75 }} className="text-[0.875rem] hover:opacity-70 transition-opacity">
                  About
                </a>
              </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[52rem] px-5 sm:px-6 py-12 sm:py-16 overflow-x-hidden">
          {children}
        </main>
        <ThemeToggle />
      </body>
    </html>
  );
}
