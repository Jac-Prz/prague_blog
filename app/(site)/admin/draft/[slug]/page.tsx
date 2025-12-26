import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PortableBody from '@/components/portable-text/PortableBody';
import { getPostBySlugAdmin } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';

// Disable static generation for this protected admin page
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminDraftPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlugAdmin(slug);

  if (!post) {
    notFound();
  }

  const isDraft = post.status === 'draft';

  return (
    <>
      {/* Admin Preview Banner */}
      <div 
        className="sticky top-0 z-50 px-5 py-3 text-center"
        style={{ 
          backgroundColor: isDraft ? 'rgba(166, 77, 77, 0.95)' : 'rgba(77, 166, 77, 0.95)',
          color: '#ffffff',
        }}
      >
        <div className="flex items-center justify-between max-w-[52rem] mx-auto">
          <span className="text-[0.875rem] font-medium">
            {isDraft ? '👁️ DRAFT PREVIEW' : '✓ PUBLISHED'} — Admin View Only
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={`/studio/structure/post;${post._id}`}
              className="text-[0.8125rem] font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#ffffff' }}
            >
              Edit in Studio
            </Link>
            <Link
              href="/admin/drafts"
              className="text-[0.8125rem] font-medium hover:opacity-80 transition-opacity"
              style={{ color: '#ffffff' }}
            >
              Back to Drafts
            </Link>
          </div>
        </div>
      </div>

      {/* Article Content (Same as public page) */}
      <article className="mx-auto max-w-[52rem] px-5 sm:px-6 py-12 sm:py-16">
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
                  {post.categories.map((cat: { _id?: string; title: string }, index: number) => (
                    <span key={cat._id || index}>
                      {index > 0 && ', '}
                      {cat.title}
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
      </article>
    </>
  );
}
