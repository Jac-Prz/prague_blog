import { getPostsByCategory } from '@/sanity/lib/queries';
import ArticleList from '@/components/ArticleList';

export default async function ThingsToDoPage() {
  const posts = await getPostsByCategory('things-to-do');

  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      <header>
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-3 sm:mb-4" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          Things to Do
        </h1>
        <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.55]" style={{
          color: 'var(--muted)',
          letterSpacing: '-0.01em'
        }}>
          What to see, skip, and experience in Prague — from an expat perspective.
        </p>
      </header>

      <ArticleList posts={posts} emptyMessage="No articles in this category yet." />
    </div>
  );
}
