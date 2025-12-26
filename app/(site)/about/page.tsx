export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
      <header>
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-3 sm:mb-4" style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          letterSpacing: '-0.025em'
        }}>
          About
        </h1>
      </header>

      <article className="flex flex-col gap-8 sm:gap-10" style={{ maxWidth: '38rem' }}>
        <section>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-3 sm:mb-4 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            What Practical Prague Is
          </h2>
          <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.65] mb-4" style={{
            color: 'var(--muted)',
            letterSpacing: '-0.01em'
          }}>
            Practical Prague is a guide to Prague written for people who want honest, practical advice. It focuses on everyday places — restaurants, neighborhoods, cafés, logistics — not attractions or tourist traps.
          </p>
          <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.65]" style={{
            color: 'var(--muted)',
            letterSpacing: '-0.01em'
          }}>
            The goal is to help visitors make better decisions about where to eat, where to stay, and how to navigate the city without wasting time on mediocre experiences.
          </p>
        </section>

        <section>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-3 sm:mb-4 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            Who It's Written By
          </h2>
          <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.65]" style={{
            color: 'var(--muted)',
            letterSpacing: '-0.01em'
          }}>
            This site is written by a long-term expat living in Prague. The recommendations reflect years of trial and error, not a weekend visit or paid partnerships.
          </p>
        </section>

        <section>
          <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold mb-3 sm:mb-4 leading-[1.3]" style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em'
          }}>
            How to Use the Site
          </h2>
          <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.65] mb-4" style={{
            color: 'var(--muted)',
            letterSpacing: '-0.01em'
          }}>
            Articles are opinionated by design. If you&apos;re new, start with the guides in "Start Here" or browse by category.
          </p>
          <p className="text-[1rem] sm:text-[1.0625rem] font-normal leading-[1.65]" style={{
            color: 'var(--muted)',
            letterSpacing: '-0.01em'
          }}>
            Everything is organized to help you find what you need quickly: Eat & Drink, Neighborhoods, Things to Do, and Practical Tips.
          </p>
        </section>
      </article>
    </div>
  );
}
