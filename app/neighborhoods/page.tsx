export default function NeighborhoodsPage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      <header>
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-3 sm:mb-4" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          Neighborhoods
        </h1>
        <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.55]" style={{
          color: 'var(--muted)',
          letterSpacing: '-0.01em'
        }}>
          Where to stay, what each area feels like, and what to expect from Prague's different districts.
        </p>
      </header>

      <section className="flex flex-col gap-8 sm:gap-10">
        {/* Article 1 */}
        <article>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            <a href="#" className="link-hover" style={{ color: 'inherit' }}>
              Where to Stay in Prague (Neighborhoods, Explained)
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            Vinohrady, Žižkov, Karlín, or Old Town? A practical breakdown of each area so you can choose wisely.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 12, 2024
          </time>
        </article>

        {/* Article 2 */}
        <article>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            <a href="#" className="link-hover" style={{ color: 'inherit' }}>
              Vinohrady: The Neighborhood Where Expats Actually Live
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            Tree-lined streets, good restaurants, and parks. Why this is Prague's most livable district.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 8, 2024
          </time>
        </article>
      </section>
    </div>
  );
}
