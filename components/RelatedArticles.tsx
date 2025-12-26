import Link from 'next/link';
import { PostListItem } from '@/sanity/lib/queries';

type RelatedArticlesProps = {
  posts: PostListItem[];
};

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t" style={{ borderColor: 'var(--border)' }}>
      <h2 
        className="text-[1.5rem] sm:text-[1.75rem] font-semibold mb-6 sm:mb-8"
        style={{ 
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}
      >
        Related Articles
      </h2>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post._id}>
            <Link 
              href={`/articles/${post.slug}`}
              className="block group"
            >
              <h3 
                className="text-[1.125rem] sm:text-[1.25rem] font-medium mb-2 group-hover:opacity-70 transition-opacity"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  color: 'var(--foreground)',
                  letterSpacing: '-0.015em'
                }}
              >
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p 
                  className="text-[0.9375rem] leading-[1.6] line-clamp-2"
                  style={{ color: 'var(--muted)' }}
                >
                  {post.excerpt}
                </p>
              )}
              
              {post.categories && post.categories.length > 0 && (
                <p 
                  className="text-[0.8125rem] mt-2"
                  style={{ color: 'var(--muted)' }}
                >
                  {post.categories.join(', ')}
                </p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </aside>
  );
}
