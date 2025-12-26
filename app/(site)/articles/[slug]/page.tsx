import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PortableBody from '@/components/portable-text/PortableBody';
import RelatedArticles from '@/components/RelatedArticles';
import { getPostBySlug, getRelatedPosts } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { siteConfig } from '@/lib/metadata';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

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

  // Fetch related posts based on category
  const categoryIds = post.categories?.map((cat: any) => cat._id).filter(Boolean) || [];
  const relatedPosts = categoryIds.length > 0 
    ? await getRelatedPosts(post._id, categoryIds, 3)
    : [];

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    author: post.author,
    imageUrl: post.featuredImage ? urlFor(post.featuredImage).width(1200).height(630).url() : undefined,
    categories: post.categories,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(
    post.categories || [],
    post.title,
    post.slug
  );

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
              <span>
                {post.categories.map((cat: any, index: number) => (
                  <span key={cat._id || index}>
                    {index > 0 && ', '}
                    <Link 
                      href={`/${cat.slug}`}
                      className="hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--accent)' }}
                    >
                      {cat.title}
                    </Link>
                  </span>
                ))}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Article Body */}
      <div className="prose-custom">
        <PortableBody value={post.body} />
      </div>

      {/* Related Articles */}
      <RelatedArticles posts={relatedPosts} />

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
    </>
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

  const metaTitle = post.seo?.metaTitle || post.title;
  const metaDescription = post.seo?.metaDescription || post.excerpt;
  
  // Use ogImage from SEO, fallback to featuredImage, then default
  const ogImageSource = post.seo?.ogImage || post.featuredImage;
  const ogImage = ogImageSource 
    ? urlFor(ogImageSource).width(1200).height(630).url()
    : `${siteConfig.url}${siteConfig.ogImage}`;

  const canonicalUrl = `${siteConfig.url}/articles/${slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: post.seo?.noIndex ? {
      index: false,
      follow: false,
    } : undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: ogImageSource?.alt || post.title 
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}
