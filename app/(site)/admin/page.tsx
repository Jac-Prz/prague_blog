"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Disable static generation for this admin page
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated via server cookie
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          router.push("/admin/drafts");
          return;
        }
      }
    } catch {
      // Not authenticated, show login form
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/drafts");
      } else {
        setError(data.error || "Invalid password");
      }
    } catch {
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <p style={{ color: 'var(--muted)' }}>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[2rem] font-semibold mb-2" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
          }}>
            Admin Access
          </h1>
          <p className="text-[0.9375rem]" style={{ color: 'var(--muted)' }}>
            Enter password to view drafts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label 
              htmlFor="password" 
              className="block text-[0.875rem] font-medium mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-[1rem] border rounded"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
              }}
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-[0.875rem]" style={{ color: '#c97d7d' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 text-[1rem] font-medium rounded transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-[0.875rem] hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
