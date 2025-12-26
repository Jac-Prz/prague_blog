import { getAllPosts } from '@/sanity/lib/queries';
import ArticleList from '@/components/ArticleList';

export default async function ArticlesPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      <header>
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-3 sm:mb-4" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          All Articles
        </h1>
        <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.55]" style={{
          color: 'var(--muted)',
          letterSpacing: '-0.01em'
        }}>
          Every guide, recommendation, and practical tip — in chronological order.
        </p>
      </header>

      <ArticleList posts={posts} emptyMessage="No articles yet. Create posts in Sanity Studio." />
    </div>
  );
}
    