import { siteConfig } from './metadata';

type ArticleSchema = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  author?: string;
  imageUrl?: string;
  categories?: Array<{ title: string; slug: string }>;
};

export function generateArticleSchema(article: ArticleSchema) {
  const articleUrl = `${siteConfig.url}/articles/${article.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt, // Use published date if no modified date available
    author: {
      '@type': 'Organization',
      name: article.author || 'Practical Prague',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Practical Prague',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
    image: article.imageUrl || `${siteConfig.url}${siteConfig.ogImage}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
}

export function generateBreadcrumbSchema(
  categories: Array<{ title: string; slug: string }>,
  articleTitle: string,
  articleSlug: string
) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteConfig.url,
    },
  ];

  // Add category breadcrumb (use first category if multiple)
  if (categories && categories.length > 0) {
    const category = categories[0];
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: category.title,
      item: `${siteConfig.url}/${category.slug}`,
    });
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: articleTitle,
      item: `${siteConfig.url}/articles/${articleSlug}`,
    });
  } else {
    // No category - just home → article
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: articleTitle,
      item: `${siteConfig.url}/articles/${articleSlug}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
