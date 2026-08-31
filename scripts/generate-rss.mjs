#!/usr/bin/env node
/**
 * Generate RSS feed for Hosp-IT articles
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ARTICLES_PATH = path.join(ROOT, 'src/data/articles.json')

export function generateRSS() {
  const articles = fs.existsSync(ARTICLES_PATH) ? JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf-8')) : []
  const sorted = [...articles].sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 20)

  const items = sorted.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>https://hosp-it.id/artikel/${a.slug}</link>
      <guid>https://hosp-it.id/artikel/${a.slug}</guid>
      <description><![CDATA[${a.excerpt}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category><![CDATA[${a.category}]]></category>
    </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Hosp-IT — Artikel & Insight RS</title>
  <link>https://hosp-it.id/artikel</link>
  <description>Panduan SIMRS, RIS PACS, SatuSehat, BPJS & Medical Infra untuk RS Indonesia. Update setiap 3 hari.</description>
  <language>id-ID</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="https://hosp-it.id/rss.xml" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`

  const out = path.join(ROOT, 'public/rss.xml')
  fs.writeFileSync(out, rss, 'utf-8')
  console.log(`✅ RSS generated: ${out} (${sorted.length} items)`)
}

if (import.meta.url.endsWith('generate-rss.mjs') || process.argv[1]?.endsWith('generate-rss.mjs')) {
  generateRSS()
}
