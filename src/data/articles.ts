// Hosp-IT Article Data Model
export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string // HTML content
  keywords: string[]
  category: 'SIMRS' | 'RIS PACS' | 'Medical Infra' | 'SatuSehat' | 'BPJS' | 'Portofolio'
  cluster: string
  coverImage: string
  coverAlt: string
  author: {
    name: string
    role: string
    avatar?: string
  }
  publishedAt: string // ISO date
  updatedAt: string // ISO date
  readingTime: number // minutes
  featured: boolean
  seo: {
    metaTitle: string
    metaDescription: string
    canonicalUrl: string
    ogImage: string
    keywords: string
  }
}

export interface Topic {
  id: number
  slug: string
  title: string
  keywords: string[]
  category: string
  cluster: string
  scheduledDate: string
  priority: string
}

// Re-export articles.json as typed data
import articlesData from './articles.json'

export const articles: Article[] = articlesData as Article[]

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getFeaturedArticles(limit = 3): Article[] {
  const featured = articles.filter(a => a.featured)
  if (featured.length >= limit) return featured.slice(0, limit)
  return getAllArticles().slice(0, limit)
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(a => a.category === category)
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const current = getArticleBySlug(currentSlug)
  if (!current) return getAllArticles().slice(0, limit)
  return articles
    .filter(a => a.slug !== currentSlug && (a.category === current.category || a.cluster === current.cluster))
    .slice(0, limit)
}

export function getCategories(): string[] {
  return [...new Set(articles.map(a => a.category))]
}

export const CATEGORY_COLOR: Record<string, string> = {
  'SIMRS': 'bg-[#0A6E7C] text-white',
  'RIS PACS': 'bg-[#00A8E8] text-white',
  'Medical Infra': 'bg-[#D97706] text-white',
  'SatuSehat': 'bg-[#10B981] text-white',
  'BPJS': 'bg-[#7C3AED] text-white',
  'Portofolio': 'bg-[#1E293B] text-white',
}
