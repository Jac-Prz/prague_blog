"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Disable static generation for this protected admin page
export const dynamic = 'force-dynamic';

type DraftPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
  status?: string;
};

export default function AdminDraftsPage() {
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Middleware handles authentication
    // Fetch drafts directly
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await fetch("/api/admin/drafts");
      if (response.ok) {
        const data = await response.json();
        setDrafts(data.drafts);
      } else {
        setError("Failed to fetch drafts");
      }
    } catch {
      setError("Error loading drafts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-[52rem] px-5 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h1 className="text-[2rem] font-semibold mb-2" style={{
              fontFamily: 'Georgia, serif',
              color: 'var(--foreground)',
            }}>
              Draft Posts
            </h1>
            <p className="text-[0.9375rem]" style={{ color: 'var(--muted)' }}>
              {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-[0.875rem] rounded hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="mb-6 text-[0.9375rem]" style={{ color: '#c97d7d' }}>
            {error}
          </p>
        )}

        {/* Draft List */}
        {drafts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[1rem] mb-2" style={{ color: 'var(--muted)' }}>
              No drafts found
            </p>
            <p className="text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
              Create a new post in Sanity Studio
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {drafts.map((draft) => (
              <article key={draft._id} className="pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-[0.75rem] px-2 py-1 rounded font-medium" style={{
                    backgroundColor: 'rgba(166, 77, 77, 0.1)',
                    color: 'var(--accent)',
                  }}>
                    DRAFT
                  </span>
                </div>
                
                <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 leading-[1.3]" style={{
                  fontFamily: 'Georgia, serif',
                  color: 'var(--foreground)',
                  letterSpacing: '-0.02em'
                }}>
                  {draft.title}
                </h2>
                
                {draft.excerpt && (
                  <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
                    {draft.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-3 text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
                  {draft.publishedAt && (
                    <time>
                      {new Date(draft.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {draft.categories && draft.categories.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{draft.categories.join(', ')}</span>
                    </>
                  )}
                </div>
                
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/admin/draft/${draft.slug}`}
                    className="px-4 py-2 text-[0.875rem] font-medium rounded hover:opacity-80 transition-opacity"
                    style={{ 
                      backgroundColor: 'var(--accent)',
                      color: 'var(--background)',
                    }}
                  >
                    Preview Post
                  </Link>
                  <a
                    href={`/studio/structure/post;${draft._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-[0.875rem] font-medium rounded border hover:opacity-70 transition-opacity"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    Edit in Studio
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t flex gap-6" style={{ borderColor: 'var(--border)' }}>
          <Link 
            href="/"
            className="text-[0.875rem] hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            ← Back to site
          </Link>
          <a 
            href="/studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.875rem] hover:opacity-70 transition-opacity"
            style={{ color: 'var(--muted)' }}
          >
            Open Studio →
          </a>
        </div>
      </div>
    </div>
  );
}
