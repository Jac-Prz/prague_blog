import { getFeaturedPosts, getLatestPosts } from '@/sanity/lib/queries';

export default async function Home() {
  // Fetch featured posts for "Start Here" section
  const featuredPosts = await getFeaturedPosts();
  
  // Fetch latest posts for "Latest Articles" section
  const latestPosts = await getLatestPosts(3);

  return (
    <div className="flex flex-col gap-10 sm:gap-16 md:gap-20">
      <header className="pt-0 sm:pt-4">
        <h1 className="text-[2rem] sm:text-[2.75rem] md:text-5xl font-semibold leading-[1.2] sm:leading-[1.15] mb-5 sm:mb-6" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          Practical Prague
        </h1>
        <p className="text-[1rem] sm:text-[1.125rem] mb-6 sm:mb-7 font-normal leading-[1.5] sm:leading-[1.55]" style={{
          color: 'var(--muted)',
          letterSpacing: '-0.01em',
          opacity: 0.8
        }}>
          Honest advice for visiting Prague — from an expat who lives here.
        </p>
        <p className="text-[0.71rem] sm:text-[0.875rem] font-semibold leading-[1.5] uppercase mb-0" style={{
          color: 'var(--foreground)',
          letterSpacing: '0.18em'
        }}>
          Eat better. Skip the tourist traps. Explore the city properly.
        </p>
      </header>

      <div className="w-[80%] sm:w-full mx-auto sm:mx-0 border-t pt-3 sm:pt-8" style={{ borderColor: 'rgba(166, 77, 77, 0.25)' }} />
      
      <section>
        <h2 className="text-[1.375rem] sm:text-[1.625rem] font-semibold mb-3" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)'
        }}>
          Start Here
        </h2>
        <p className="text-[0.875rem] sm:text-[0.9375rem] mb-5 sm:mb-6" style={{ color: 'var(--muted)' }}>
          The best place to begin if you're visiting Prague for the first time.
        </p>
        
        {featuredPosts.length > 0 ? (
          <div className="flex flex-col gap-2 sm:gap-4 pb-6 sm:pb-8">
            {featuredPosts.map((post) => (
              <h3 key={post._id} className="text-[1.0625rem] sm:text-[1.3125rem] font-semibold leading-[1.4]" style={{
                fontFamily: 'Georgia, serif',
                color: 'var(--foreground)'
              }}>
                <a 
                  href={`/articles/${post.slug}`} 
                  className="link-hover transition-all inline-block py-1.5 sm:py-0 active:underline active:opacity-80" 
                  style={{ color: 'inherit' }}
                >
                  {post.title}
                </a>
              </h3>
            ))}
          </div>
        ) : (
          /* Mock content - will show until posts are created */
          <div className="flex flex-col gap-2 sm:gap-4 pb-6 sm:pb-8">
            <p className="text-[0.875rem] italic" style={{ color: 'var(--muted)' }}>
              No featured posts yet. Mark posts as "Featured" in Sanity to display them here.
            </p>
            {/* 
            <h3 className="text-[1.0625rem] sm:text-[1.3125rem] font-semibold leading-[1.4]" style={{
              fontFamily: 'Georgia, serif',
              color: 'var(--foreground)'
            }}>
              <a href="#" className="link-hover transition-all inline-block py-1.5 sm:py-0 active:underline active:opacity-80" style={{ color: 'inherit' }}>
                What to Skip in Prague (And What to Do Instead)
              </a>
            </h3>
            */}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-9">
          <h2 className="text-[1.375rem] sm:text-[1.5rem] font-semibold whitespace-nowrap" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)'
          }}>
            Latest Articles
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
        </div>
        
        {latestPosts.length > 0 ? (
          <div className="flex flex-col gap-10 sm:gap-12">
            {latestPosts.map((post) => (
              <article key={post._id}>
                <h3 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 sm:mb-2.5 leading-[1.3] sm:leading-[1.25]" style={{
                  fontFamily: 'Georgia, serif',
                  color: 'var(--foreground)'
                }}>
                  <a href={`/articles/${post.slug}`} style={{ color: 'inherit' }} className="link-hover transition-all">
                    {post.title}
                  </a>
                </h3>
                <p className="text-[0.875rem] sm:text-[0.9375rem] leading-[1.6] sm:leading-[1.65]" style={{ color: 'var(--muted)' }}>
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        ) : (
          /* Mock content - will show until posts are created */
          <div className="text-[0.875rem] italic" style={{ color: 'var(--muted)' }}>
            <p>No articles yet. Create posts in Sanity Studio to display them here.</p>
            {/*
            <div className="flex flex-col gap-10 sm:gap-12">
              <article>
                <h3 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 sm:mb-2.5 leading-[1.3] sm:leading-[1.25]" style={{
                  fontFamily: 'Georgia, serif',
                  color: 'var(--foreground)'
                }}>
                  <a href="#" style={{ color: 'inherit' }} className="link-hover transition-all">
                    Where to Find the Best Traditional Czech Food
                  </a>
                </h3>
                <p className="text-[0.875rem] sm:text-[0.9375rem] leading-[1.6] sm:leading-[1.65]" style={{ color: 'var(--muted)' }}>
                  Authentic Czech restaurants where locals actually eat.
                </p>
              </article>
            </div>
            */}
          </div>
        )}
        
        <div className="pt-6 sm:pt-8">
          <a 
            href="/articles" 
            className="inline-flex items-center gap-2 text-[0.9375rem] font-medium hover:opacity-70 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            View all articles
            <span style={{ fontSize: '0.75em' }}>→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
