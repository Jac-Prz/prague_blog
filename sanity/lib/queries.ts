import { client } from './client';

// Post list item type for article listings
export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
};

// Get featured posts for "Start Here" section
export async function getFeaturedPosts(): Promise<PostListItem[]> {
  const query = `*[_type == "post" && featured == true && status == "published"] | order(publishedAt desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}

// Get latest posts for "Latest Articles" section
export async function getLatestPosts(limit: number = 5): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}

// Get posts by category
export async function getPostsByCategory(categorySlug: string): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "published" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query, { categorySlug });
}

// Get all posts (for articles archive)
export async function getAllPosts(): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}

// Get single post by slug (published only)
export async function getPostBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->name,
    "categories": categories[]->{
      title,
      "slug": slug.current,
      _id
    },
    body,
    featuredImage {
      asset->,
      alt
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset->,
        alt
      },
      noIndex
    },
    mainImage {
      asset->,
      alt
    }
  }`;
  
  return client.fetch(query, { slug });
}

// Get all post slugs (for static generation)
export async function getAllPostSlugs(): Promise<string[]> {
  const query = `*[_type == "post" && status == "published" && defined(slug.current)].slug.current`;
  return client.fetch(query);
}

// Get related posts (same category, exclude current post)
export async function getRelatedPosts(currentPostId: string, categoryIds: string[], limit: number = 4): Promise<PostListItem[]> {
  // If no categories, return empty array
  if (!categoryIds || categoryIds.length === 0) {
    return [];
  }

  const query = `*[
    _type == "post" 
    && status == "published" 
    && _id != $currentPostId
    && count((categories[]._ref)[@ in $categoryIds]) > 0
  ] | order(publishedAt desc) [0...${limit}] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query, { currentPostId, categoryIds });
}

// ===== ADMIN QUERIES (Include Drafts) =====

// Get single post by slug for admin preview (no status filter)
export async function getPostBySlugAdmin(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    status,
    "author": author->name,
    "categories": categories[]->{
      title,
      "slug": slug.current,
      _id
    },
    body,
    featuredImage {
      asset->,
      alt
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset->,
        alt
      },
      noIndex
    },
    mainImage {
      asset->,
      alt
    }
  }`;
  
  return client.fetch(query, { slug });
}

// Get all draft posts
export async function getDraftPosts(): Promise<PostListItem[]> {
  const query = `*[_type == "post" && status == "draft"] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}

// Get all posts including drafts (for admin)
export async function getAllPostsAdmin(): Promise<PostListItem[]> {
  const query = `*[_type == "post"] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    status,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}
