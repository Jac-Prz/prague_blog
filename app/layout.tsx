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
            <div className="text-[0.8125rem] font-medium uppercase tracking-[0.12em] whitespace-nowrap" style={{
              color: 'var(--muted)'
            }}>
              Practical Prague
            </div>
            
            {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-7 text-[0.9375rem]" style={{ color: 'var(--foreground)' }}>
              <li>
                <a href="#" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity font-medium">
                  Eat & Drink
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                  Neighborhoods
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                  Things to Do
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'inherit' }} className="hover:opacity-70 transition-opacity">
                  Practical Tips
                </a>
              </li>
              <li className="ml-5 pl-5" style={{ borderLeft: '1px solid var(--border)' }}>
                <a href="#" style={{ color: 'var(--muted)', opacity: 0.75 }} className="hover:opacity-70 transition-opacity">
                  About
                </a>
              </li>
            </ul>

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
