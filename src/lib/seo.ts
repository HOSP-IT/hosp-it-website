// SEO helpers for Hosp-IT Articles
export function generateArticleJsonLd(article: {
  title: string
  excerpt: string
  slug: string
  coverImage: string
  publishedAt: string
  updatedAt: string
  author: { name: string; role: string }
  keywords: string[]
}) {
  const url = `https://hosp-it.id/artikel/${article.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: `https://hosp-it.id${article.coverImage}`,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hosp-IT',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hosp-it.id/images/hospit-logo.png',
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: article.keywords.join(', '),
    articleSection: 'Kesehatan & Teknologi RS',
    inLanguage: 'id-ID',
  }
}

export function generateBreadcrumbJsonLd(articleTitle: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://hosp-it.id/' },
      { '@type': 'ListItem', position: 2, name: 'Artikel', item: 'https://hosp-it.id/artikel' },
      { '@type': 'ListItem', position: 3, name: articleTitle, item: `https://hosp-it.id/artikel/${slug}` },
    ],
  }
}

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.ceil(words / 200))
}
