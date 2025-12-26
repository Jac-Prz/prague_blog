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
  const query = `*[_type == "post" && featured == true] | order(publishedAt desc) [0...4] {
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
  const query = `*[_type == "post"] | order(publishedAt desc) [0...${limit}] {
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
  const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
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
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}

// Get single post by slug
export async function getPostBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "author": author->name,
    "categories": categories[]->{
      title,
      "slug": slug.current
    },
    body,
    metaTitle,
    metaDescription,
    featuredImage {
      asset->,
      alt
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
  const query = `*[_type == "post" && defined(slug.current)].slug.current`;
  return client.fetch(query);
}
