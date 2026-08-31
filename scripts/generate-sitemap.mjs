#!/usr/bin/env node
/**
 * Generate sitemap.xml from src/data/articles.json
 * Includes static routes + all published articles
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ARTICLES_PATH = path.join(ROOT, 'src/data/articles.json')
const SITEMAP_PATH = path.join(ROOT, 'public/sitemap.xml')

export async function generateSitemap() {
  const articles = fs.existsSync(ARTICLES_PATH) ? JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf-8')) : []
  
  const staticUrls = [
    { loc: 'https://hosp-it.id/', lastmod: '2026-09-03', changefreq: 'weekly', priority: '1.0' },
    { loc: 'https://hosp-it.id/integrasi-satusehat', lastmod: '2026-07-07', changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://hosp-it.id/artikel', lastmod: new Date().toISOString().slice(0,10), changefreq: 'daily', priority: '0.9' },
  ]

  const articleUrls = articles
    .sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .map(a => ({
      loc: `https://hosp-it.id/artikel/${a.slug}`,
      lastmod: new Date(a.updatedAt || a.publishedAt).toISOString().slice(0,10),
      changefreq: 'weekly',
      priority: a.featured ? '0.8' : '0.7'
    }))

  const allUrls = [...staticUrls, ...articleUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

  fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8')
  console.log(`✅ Sitemap generated: ${SITEMAP_PATH} (${allUrls.length} URLs: ${staticUrls.length} static + ${articleUrls.length} articles)`)
  return xml
}

// CLI direct run
if (import.meta.url === `file://${process.argv[1].replace(/\\/g,'/')}` || process.argv[1]?.endsWith('generate-sitemap.mjs')) {
  generateSitemap().catch(e => { console.error(e); process.exit(1) })
}
