export default function PracticalTipsPage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      <header>
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-3 sm:mb-4" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          Practical Tips
        </h1>
        <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.55]" style={{
          color: 'var(--muted)',
          letterSpacing: '-0.01em'
        }}>
          The logistics, systems, and unspoken rules that help you navigate Prague like a local.
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
              How Prague's Public Transport Actually Works
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            Trams, metro, tickets, and what tourists get wrong about getting around the city.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 14, 2024
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
              Currency Exchange: How Not to Get Ripped Off
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            The scams to avoid, the best places to exchange money, and whether you should use cash or card.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 7, 2024
          </time>
        </article>
      </section>
    </div>
  );
}
