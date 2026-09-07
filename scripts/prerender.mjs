#!/usr/bin/env node
/**
 * Prerender static HTML for SEO - Fixes "Alternate page with proper canonical" & "Crawled not indexed"
 * Generates dist/artikel/index.html and dist/artikel/{slug}/index.html with correct <title>, <meta>, <link canonical>, JSON-LD
 * Cloudflare Pages will serve these static files instead of SPA fallback, so Google sees unique HTML per URL.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ARTICLES_PATH = path.join(ROOT, 'src/data/articles.json')
const DIST = path.join(ROOT, 'dist')
const DIST_INDEX = path.join(DIST, 'index.html')

function loadArticles() {
  if (!fs.existsSync(ARTICLES_PATH)) return []
  return JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf-8'))
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function buildHead({ title, description, canonical, ogImage, keywords, jsonLd }) {
  return `    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ''}
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="https://hosp-it.id${ogImage}" />
    <meta property="og:locale" content="id_ID" />
    <meta property="og:site_name" content="HOSP-IT" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="https://hosp-it.id${ogImage}" />${jsonLd ? `\n    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}`
}

function injectIntoHtml(baseHtml, headExtra, rootInner) {
  let html = baseHtml
  html = html.replace(/<title>.*?<\/title>/s, headExtra.split('\n')[0])
  html = html.replace('</head>', `${headExtra}\n  </head>`)
  if (rootInner) {
    html = html.replace('<div id="root"></div>', `<div id="root">${rootInner}</div>`)
  }
  return html
}

function articleJsonLd(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": `https://hosp-it.id${article.coverImage}`,
    "author": { "@type": "Person", "name": article.author.name, "jobTitle": article.author.role },
    "publisher": { "@type": "Organization", "name": "Hosp-IT", "logo": { "@type": "ImageObject", "url": "https://hosp-it.id/images/hospit-logo.png" } },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://hosp-it.id/artikel/${article.slug}` },
    "keywords": article.keywords.join(', '),
    "inLanguage": "id-ID"
  }
}

function breadcrumbJsonLd(article) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://hosp-it.id/" },
      { "@type": "ListItem", "position": 2, "name": "Artikel", "item": "https://hosp-it.id/artikel" },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://hosp-it.id/artikel/${article.slug}` }
    ]
  }
}

async function main() {
  if (!fs.existsSync(DIST_INDEX)) {
    console.error('dist/index.html not found — run npm run build first')
    process.exit(1)
  }
  const baseHtml = fs.readFileSync(DIST_INDEX, 'utf-8')
  const articles = loadArticles()
  console.log(`Prerendering ${articles.length} articles + /artikel`)

  const artikelListDir = path.join(DIST, 'artikel')
  fs.mkdirSync(artikelListDir, { recursive: true })
  const listHead = buildHead({
    title: 'Artikel & Insight RS — Hosp-IT | SIMRS, RIS PACS & SatuSehat',
    description: 'Kumpulan artikel Hosp-IT: panduan SIMRS 61 modul, RIS PACS DICOM 3.0, SatuSehat, BPJS & Medical Infra untuk RS Indonesia. Update tiap 3 hari.',
    canonical: 'https://hosp-it.id/artikel',
    ogImage: '/images/hero-main.jpg',
    keywords: 'artikel RS, SIMRS, RIS PACS, SatuSehat, BPJS, Hosp-IT',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Artikel Hosp-IT",
      "description": "Artikel & Insight RS Indonesia",
      "url": "https://hosp-it.id/artikel"
    }
  })
  const listRoot = `<main style="max-width:800px;margin:80px auto;padding:24px;font-family:sans-serif"><h1>Artikel & Insight Hosp-IT</h1><p>${articles.length} artikel panduan SIMRS, RIS PACS, SatuSehat & BPJS — update tiap 3 hari.</p><ul>${articles.map(a=>`<li><a href="/artikel/${a.slug}">${escapeHtml(a.title)}</a> — ${a.category}</li>`).join('')}</ul><p><a href="/">Kembali ke Beranda</a> | <a href="/sitemap.xml">Sitemap</a></p></main>`
  let listHtml = baseHtml
  listHtml = listHtml.replace(/<link rel="canonical" href="[^"]*" \/>/, '')
  listHtml = injectIntoHtml(listHtml, listHead, listRoot)
  fs.writeFileSync(path.join(artikelListDir, 'index.html'), listHtml, 'utf-8')
  console.log('  → dist/artikel/index.html')

  for (const a of articles) {
    const dir = path.join(DIST, 'artikel', a.slug)
    fs.mkdirSync(dir, { recursive: true })
    const head = buildHead({
      title: a.seo.metaTitle,
      description: a.seo.metaDescription,
      canonical: a.seo.canonicalUrl,
      ogImage: a.coverImage,
      keywords: a.seo.keywords,
      jsonLd: articleJsonLd(a)
    })
    const fullHead = head + `\n    <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd(a))}</script>`
    const body = `<article style="max-width:800px;margin:40px auto;padding:24px;font-family:sans-serif;line-height:1.7">
      <nav style="font-size:13px;color:#64748B"><a href="/">Beranda</a> / <a href="/artikel">Artikel</a> / ${escapeHtml(a.category)}</nav>
      <p style="display:inline-block;background:#0A6E7C;color:white;padding:4px 10px;border-radius:999px;font-size:12px;margin:16px 0 8px">${escapeHtml(a.category)} • ${escapeHtml(a.cluster)}</p>
      <h1 style="font-size:28px;line-height:1.2;color:#0A1628;margin:8px 0">${escapeHtml(a.title)}</h1>
      <p style="color:#64748B">${escapeHtml(a.excerpt)}</p>
      <p style="font-size:13px;color:#94A3B8">${new Date(a.publishedAt).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})} • ${a.readingTime} menit baca • ${escapeHtml(a.author.name)}</p>
      <img src="${a.coverImage}" alt="${escapeHtml(a.coverAlt)}" style="width:100%;height:auto;border-radius:12px;margin:16px 0" />
      <div>${a.content}</div>
      <hr style="margin:24px 0" />
      <p><strong>Butuh konsultasi?</strong> <a href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20baca%20${encodeURIComponent(a.title)}">Konsultasi gratis via WhatsApp</a> • <a href="/artikel">Lihat artikel lain</a></p>
    </article>`
    let html = baseHtml
    html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, '')
    html = injectIntoHtml(html, fullHead, body)
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
    console.log(`  → dist/artikel/${a.slug}/index.html`)
  }

  console.log(`\n✅ Prerender done: ${articles.length + 1} HTML files`)
}

main().catch(e=>{ console.error(e); process.exit(1) })
