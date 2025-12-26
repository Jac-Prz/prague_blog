import type { PostListItem } from '@/sanity/lib/queries';

type ArticleListProps = {
  posts: PostListItem[];
  emptyMessage?: string;
};

export default function ArticleList({ posts, emptyMessage = 'No articles yet.' }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-[0.875rem] italic" style={{ color: 'var(--muted)' }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-8 sm:gap-10">
      {posts.map((post) => (
        <article key={post._id}>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            <a href={`/articles/${post.slug}`} className="link-hover" style={{ color: 'inherit' }}>
              {post.title}
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            {post.excerpt}
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }} dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
        </article>
      ))}
    </section>
  );
}
