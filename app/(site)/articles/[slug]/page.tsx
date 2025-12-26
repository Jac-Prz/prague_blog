import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import PortableBody from '@/components/portable-text/PortableBody';
import { getPostBySlug } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-10 sm:mb-12 -mx-5 sm:-mx-6">
          <Image
            src={urlFor(post.featuredImage).width(1200).height(630).url()}
            alt={post.featuredImage.alt || post.title}
            width={1200}
            height={630}
            className="w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-10 sm:mb-12">
        <h1 
          className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-semibold leading-[1.2] mb-4 sm:mb-5"
          style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.025em'
          }}
        >
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p 
            className="text-[1.125rem] sm:text-[1.25rem] leading-[1.55] mb-5"
            style={{ color: 'var(--muted)' }}
          >
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-[0.875rem]" style={{ color: 'var(--muted)' }}>
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.author && (
            <>
              <span>•</span>
              <span>{post.author}</span>
            </>
          )}
          {post.categories && post.categories.length > 0 && (
            <>
              <span>•</span>
              <span>{post.categories.map(cat => cat.title).join(', ')}</span>
            </>
          )}
        </div>
      </header>

      {/* Article Body */}
      <div className="prose-custom">
        <PortableBody value={post.body} />
      </div>

      {/* Back to Articles */}
      <div className="mt-12 sm:mt-16 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <a 
          href="/articles"
          className="inline-flex items-center gap-2 text-[0.9375rem] font-medium hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent)' }}
        >
          <span style={{ fontSize: '0.75em' }}>←</span>
          Back to all articles
        </a>
      </div>
    </article>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.excerpt;
  const ogImage = post.featuredImage 
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.featuredImage?.alt || post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
