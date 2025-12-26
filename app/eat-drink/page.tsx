export default function EatDrinkPage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      <header>
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-3 sm:mb-4" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          Eat & Drink
        </h1>
        <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.55]" style={{
          color: 'var(--muted)',
          letterSpacing: '-0.01em'
        }}>
          Honest recommendations for cafés, restaurants, and places worth eating in Prague.
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
              A Practical Guide to Eating Well in Prague
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            Skip the tourist traps. Where to find authentic Czech food, modern bistros, and cafés that locals actually visit.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 15, 2024
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
              Cafés Locals Actually Go To
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            Third-wave coffee, quiet work spots, and neighborhood cafés that aren't overrun with tour groups.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 10, 2024
          </time>
        </article>

        {/* Article 3 */}
        <article>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-2 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            <a href="#" className="link-hover" style={{ color: 'inherit' }}>
              Where to Get Breakfast in Prague (That Isn't a Hotel Buffet)
            </a>
          </h2>
          <p className="text-[0.9375rem] sm:text-[1rem] leading-[1.65] mb-2" style={{ color: 'var(--muted)' }}>
            Prague's breakfast scene has improved dramatically. Here's where to start your morning properly.
          </p>
          <time className="text-[0.8125rem] sm:text-[0.875rem]" style={{ color: 'var(--muted)', opacity: 0.7 }}>
            December 5, 2024
          </time>
        </article>
      </section>
    </div>
  );
}
