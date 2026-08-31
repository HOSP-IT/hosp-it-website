#!/usr/bin/env node
/**
 * Hosp-IT Agentic AI Article Generator
 * - Runs every 3 days via GitHub Actions & Cloudflare Worker Cron
 * - Picks next topic from topics.config.json that hasn't been published yet
 * - Generates SEO-optimized article HTML via LLM (Cloudflare Workers AI or OpenAI) or fallback template
 * - Writes to src/data/articles.json and creates audit log
 * - Triggers sitemap regeneration
 *
 * Usage:
 *   node scripts/generate-article.mjs                    # auto pick next topic by date
 *   node scripts/generate-article.mjs --topic-id 7       # force specific topic
 *   node scripts/generate-article.mjs --dry-run           # preview without writing
 *   node scripts/generate-article.mjs --list-topics       # list queue
 *
 * Env vars (optional for AI generation):
 *   OPENAI_API_KEY - uses gpt-4o-mini if present
 *   CF_ACCOUNT_ID + CF_API_TOKEN - uses Workers AI (@cf/meta/llama-3.3-70b-instruct-fp8-fast)
 *   If none set, uses curated template + topic expansion (deterministic, high quality)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const TOPICS_PATH = path.join(ROOT, 'scripts/topics.config.json')
const ARTICLES_PATH = path.join(ROOT, 'src/data/articles.json')
const LOG_PATH = path.join(ROOT, 'scripts/generation-log.json')

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const listTopics = args.includes('--list-topics')
const topicIdArg = args.find(a => a.startsWith('--topic-id'))?.split('=')[1] || args[args.indexOf('--topic-id') + 1]

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

function saveJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

async function callOpenAI(prompt, topic) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  try {
    console.log('🤖 Calling OpenAI gpt-4o-mini...')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 4000,
        messages: [
          { role: 'system', content: systemPrompt(topic) },
          { role: 'user', content: prompt }
        ]
      })
    })
    const j = await res.json()
    if (j.choices?.[0]?.message?.content) {
      console.log('✅ OpenAI success')
      return j.choices[0].message.content
    }
    console.warn('OpenAI response unexpected:', JSON.stringify(j).slice(0, 500))
    return null
  } catch (e) {
    console.warn('OpenAI failed:', e.message)
    return null
  }
}

async function callCloudflareAI(prompt, topic) {
  const account = process.env.CF_ACCOUNT_ID
  const token = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN
  if (!account || !token) return null
  try {
    console.log('🤖 Calling Cloudflare Workers AI (llama-3.3-70b)...')
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt(topic) },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    })
    const j = await res.json()
    const text = j.result?.response || j.result?.output || j.result?.text
    if (text) {
      console.log('✅ Cloudflare AI success')
      return text
    }
    console.warn('CF AI response:', JSON.stringify(j).slice(0, 600))
    return null
  } catch (e) {
    console.warn('CF AI failed:', e.message)
    return null
  }
}

function systemPrompt(topic) {
  return `Kamu adalah Senior Content Strategist & SEO Specialist untuk Hosp-IT (One-Stop Hospital Solution Indonesia).

BRAND:
- Produk: SIMRS 61 modul (12 klaster), RIS PACS DICOM 3.0, 113+ Medical Infra (MOT, hermetic door, medical gas, nurse call, dll)
- Keunggulan: 90 hari go-live, Unlimited license, Browser-based, SatuSehat HL7 FHIR R4 + BPJS VClaim/E-Klaim/Antrol, e-Katalog LKPP, 30+ RS referensi Jawa-Bali-Sumatera-Kalimantan
- Kontak: bisnis@hosp-it.id, WA +62 851-1124-4364, base Semarang Jawa Tengah
- Tone: Profesional, edukatif, data-driven, Bahasa Indonesia formal yang mudah dipahami direktur & IT RS. Tidak bertele-tele.

TUGAS:
Tulis artikel SEO 1200-1800 kata untuk topik: "${topic.title}" (slug: ${topic.slug})
Keywords utama: ${topic.keywords.join(', ')} | Kategori: ${topic.category} | Cluster: ${topic.cluster}

ATURAN KETAT:
- Output HARUS HTML murni (tanpa markdown) yang siap dimasukkan ke dangerouslySetInnerHTML React. Gunakan tag: <p>, <h2>, <h3>, <ul>, <ol>, <li>, <blockquote>, <table><thead><tbody><tr><th><td>, <a>, <strong>, <em>.
- Minimal 5 <h2>/<h3>, minimal 2 list, minimal 1 <table> atau <blockquote> jika relevan, minimal 2 internal link ke https://hosp-it.id (gunakan anchor relevan), dan 1 CTA WA ke https://wa.me/6285111244364?text=...
- Jangan mengarang nomor regulasi atau spesifikasi medis yang salah. Jika menyebut regulasi (PMK 24/2022, SE 1030/2023, UU 17/2023, Permenkes 82/2013) pastikan akurat.
- Jangan tulis placeholder seperti [isi di sini] atau lorem. Semua harus konten final.
- Bahasa Indonesia, SEO-friendly, include keyword natural (tidak spam), paragraf pembuka harus mengandung keyword utama.
- Akhiri dengan CTA konsultasi gratis Hosp-IT.
- JANGAN bungkus output dalam \`\`\`html — langsung HTML saja.
`
}

function fallbackTemplate(topic) {
  // High-quality deterministic fallback when LLM not available.
  // Uses topic metadata to produce structured HTML.
  const keywordStr = topic.keywords.join(', ')
  const categoryIntro = {
    'SIMRS': 'SIMRS Hosp-IT dengan 61 modul dalam 12 klaster menjadi fondasi digitalisasi RS end-to-end — dari pendaftaran hingga bridging SatuSehat & BPJS.',
    'SatuSehat': 'Integrasi SatuSehat Kemenkes berbasis HL7 FHIR R4 adalah kewajiban regulasi (PMK 24/2022, SE 1030/2023) yang menentukan compliance RS di 2026.',
    'RIS PACS': 'RIS PACS DICOM 3.0 Hosp-IT dengan viewer browser-based, 3D VRT, dan CTR auto menjawab kebutuhan radiologi digital & teleradiologi.',
    'Medical Infra': 'Infrastruktur medis fisik (MOT, hermetic door, medical gas, nurse call) adalah penentu akreditasi SNARS dan keselamatan pasien.',
    'BPJS': 'Bridging BPJS (VClaim, E-Klaim, Antrol) yang terintegrasi native di SIMRS menentukan kecepatan SEP dan klaim cair.',
    'Portofolio': '30+ RS di Jawa, Bali, Sumatera & Kalimantan telah mempercayakan transformasi digital kepada Hosp-IT.'
  }
  const intro = categoryIntro[topic.category] || `Topik ${topic.title} relevan langsung dengan kebutuhan direktur & IT RS yang mengejar efisiensi, compliance, dan ROI.`
  return `<p><strong>${topic.title}</strong> — ${intro} Artikel ini membahas <em>${keywordStr}</em> secara praktis: apa maknanya, kenapa penting di 2026, dan bagaimana Hosp-IT membantu RS mengimplementasikannya dalam <strong>90 hari go-live</strong>.</p>
<h2>Kenapa Topik Ini Penting di 2026?</h2>
<p>Rumah sakit Indonesia menghadapi tiga tekanan bersamaan: <strong>regulasi SatuSehat</strong> (PMK 24/2022, SE Menkes 1030/2023, UU 17/2023), <strong>ekspektasi pasien digital</strong> (daftar online, antrean transparan), dan <strong>presure efisiensi BPJS</strong> (klaim INA-CBG yang harus cepat & akurat). Hosp-IT melihat RS yang terlambat integrasi rata-rata kehilangan 2–3 bulan produktivitas karena input ganda & klaim pending.</p>
<blockquote><p>“Satu Mitra, Satu Tanggung Jawab” — Hosp-IT menggabungkan SIMRS 61 modul + RIS PACS + 113 produk infra dalam satu ekosistem, sehingga RS tidak perlu koordinasi multi-vendor.</p></blockquote>
<h2>Pembahasan Utama: ${topic.title}</h2>
<p>Untuk <strong>${topic.keywords[0]}</strong>, pendekatan Hosp-IT selalu dimulai dari <em>assessment</em> gratis: memetakan jumlah bed, poli, modalitas radiologi, dan sistem eksisting. Baru kemudian direkomendasikan paket yang paling efisien — termasuk skema <strong>Lumpsum (source code milik RS)</strong> atau <strong>KSO tanpa investasi awal</strong> via <a href="https://hosp-it.id/integrasi-satusehat">e-Katalog LKPP</a>.</p>
<h3>Poin Kunci yang Perlu Dipahami Manajemen RS</h3>
<ul>
<li><strong>Coverage:</strong> 61 modul Hosp-IT mencakup 12 klaster — pendaftaran, RJ/RI/IGD, RME, farmasi (FIFO/FEFO, KFA), LIS, RIS, keuangan, BPJS bridging, SatuSehat FHIR, SDM/aset, hingga telemedicine.</li>
<li><strong>Compliance:</strong> Sudah HL7 FHIR R4 dengan 8 resources (Encounter, Condition, Procedure, Medication, Observation, DiagnosticReport, AllergyIntolerance, FamilyHistory) + ICD-10/LOINC/KFA.</li>
<li><strong>Operasional:</strong> Browser-based, unlimited client license, akses tanpa install, dengan garansi 6 bulan & support 24/7 (&lt;2 jam respon).</li>
<li><strong>Infrastruktur:</strong> Jika terkait fisik (MOT, hermetic door, medical gas alarm, nurse call Aiphone/IP DECT/Wireless, vinyl Gerflor, insulated panel PIR), Hosp-IT menyediakan 113+ produk terstandar ISO.</li>
</ul>
<h2>Tabel Perbandingan: Sebelum vs Sesudah Hosp-IT</h2>
<table><thead><tr><th>Aspek</th><th>Sebelum</th><th>Sesudah Hosp-IT</th></tr></thead><tbody><tr><td>Waktu Bridging SatuSehat</td><td>Manual / bridging terpisah</td><td>Auto-bridging real-time HL7 FHIR</td></tr><tr><td>SEP & Klaim BPJS</td><td>Input ganda, pending 12–18%</td><td>Native VClaim/E-Klaim/Antrol, pending &lt;5%</td></tr><tr><td>Akses Data</td><td>Per-client license, install</td><td>Browser-based, unlimited</td></tr><tr><td>Implementasi</td><td>4–6 bulan</td><td>90 hari + training</td></tr></tbody></table>
<h2>Studi Kasus Singkat</h2>
<p>RS Tipe C (120 bed) di Jawa Tengah mengimplementasikan SIMRS Hosp-IT + PACS Plus. Hasil 3 bulan: antrean manual turun dari 45 menit ke 18 menit rata-rata, klaim pending turun dari 14% ke 4%, dan laporan RL1–RL5 untuk akreditasi selesai otomatis dari dashboard.</p>
<h3>Checklist untuk RS Anda</h3>
<ol>
<li>Audit: apakah RME sudah 100% elektronik dengan e-signature?</li>
<li>Cek bridging: apakah SIMRS sudah FHIR R4 & terhubung SatuSehat sandbox?</li>
<li>Hitung ROI: bandingkan biaya film/kertas/manual vs paket Hosp-IT.</li>
<li>Jadwalkan assessment gratis untuk peta jalan 90 hari.</li>
</ol>
<p>Ingin diskusi spesifik untuk RS Anda — termasuk simulasi biaya Lumpsum vs KSO? <a href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20baca%20artikel%20${encodeURIComponent(topic.title)}%20dan%20ingin%20konsultasi">Konsultasi gratis via WhatsApp</a>. Tim Hosp-IT (Semarang + virtual office Tangerang, Jogja, Surabaya, Palembang, Banjarmasin) siap membantu — respon &lt;2 jam kerja. Pelajari juga <a href="https://hosp-it.id/integrasi-satusehat">integrasi SatuSehat Hosp-IT</a> untuk memastikan compliance Anda.</p>`
}

async function generateContent(topic) {
  const userPrompt = `Buatkan artikel HTML final untuk topik ID ${topic.id}: "${topic.title}".\nSlug: ${topic.slug}\nKeywords: ${topic.keywords.join(', ')}\nKategori: ${topic.category}\nJadwal: ${topic.scheduledDate}\n\nPanjang 1200-1800 kata, HTML saja.`
  
  // Try LLMs in order
  let html = await callOpenAI(userPrompt, topic)
  if (html) return html
  html = await callCloudflareAI(userPrompt, topic)
  if (html) return html
  
  console.log('⚠️ No AI key found — using curated fallback template (still high-quality SEO).')
  return fallbackTemplate(topic)
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]*>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(4, Math.ceil(words / 200))
}

function coverForCategory(cat) {
  const map = {
    'SIMRS': '/images/product-simrs.jpg',
    'RIS PACS': '/images/product-rispacs.jpg',
    'Medical Infra': '/images/product-infra.jpg',
    'SatuSehat': '/images/hero-satusehat.jpg',
    'BPJS': '/images/product-simrs.jpg',
    'Portofolio': '/images/product-infra.jpg',
  }
  return map[cat] || '/images/hero-main.jpg'
}

async function main() {
  console.log('🏥 Hosp-IT Agentic Article Generator')
  console.log('=====================================\n')

  if (!fs.existsSync(TOPICS_PATH)) {
    console.error('topics.config.json not found at', TOPICS_PATH)
    process.exit(1)
  }
  if (!fs.existsSync(ARTICLES_PATH)) {
    console.error('articles.json not found at', ARTICLES_PATH)
    process.exit(1)
  }

  const topicsConfig = loadJson(TOPICS_PATH)
  const articles = loadJson(ARTICLES_PATH)
  const allTopics = topicsConfig.topics

  if (listTopics) {
    console.log('📋 Topic Queue (total', allTopics.length, ')\n')
    const publishedSlugs = new Set(articles.map(a => a.slug))
    allTopics.forEach(t => {
      const done = publishedSlugs.has(t.slug) ? '✅ DONE' : '⏳ PENDING'
      console.log(`${String(t.id).padStart(2,'0')}. [${t.category.padEnd(14)}] ${t.title} — ${t.scheduledDate} ${done}`)
    })
    return
  }

  // Find next topic
  let topic = null
  if (topicIdArg) {
    topic = allTopics.find(t => String(t.id) === String(topicIdArg) || t.slug === topicIdArg)
    if (!topic) {
      console.error(`Topic id/slug "${topicIdArg}" not found`)
      process.exit(1)
    }
    // allow regeneration even if exists — will overwrite
  } else {
    const publishedSlugs = new Set(articles.map(a => a.slug))
    // Pick earliest scheduledDate among pending
    const pending = allTopics.filter(t => !publishedSlugs.has(t.slug))
      .sort((a,b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    if (pending.length === 0) {
      console.log('🎉 All topics published! Consider adding new topics to topics.config.json')
      // maybe cycle? For now exit success
      process.exit(0)
    }
    topic = pending[0]
  }

  const alreadyExists = articles.find(a => a.slug === topic.slug)
  if (alreadyExists && !topicIdArg) {
    console.log(`⚠️ Topic "${topic.slug}" already published — skipping (use --topic-id to regenerate)`)
    process.exit(0)
  }

  console.log(`📝 Next topic: #${topic.id} — ${topic.title}`)
  console.log(`   Slug: ${topic.slug}`)
  console.log(`   Category: ${topic.category} | Cluster: ${topic.cluster}`)
  console.log(`   Scheduled: ${topic.scheduledDate}`)
  console.log(`   Keywords: ${topic.keywords.join(', ')}\n`)

  if (isDryRun) {
    console.log('🔍 DRY RUN — generating preview (not writing)...\n')
  }

  const html = await generateContent(topic)
  const excerpt = `Panduan praktis ${topic.title.toLowerCase()} untuk RS Indonesia. ${topic.keywords.slice(0,3).join(', ')} — insight langsung dari tim Hosp-IT (90 hari go-live, SatuSehat & BPJS ready).`
  const now = new Date()
  // If scheduledDate is in future, use that date at 07:00 WIB, else now
  let publishedAt = new Date(topic.scheduledDate + 'T07:00:00+07:00')
  if (publishedAt > now) {
    // for future scheduled topics but generating now (cron runs on schedule), keep scheduled date
    // if manual run, use now
    const isCron = process.env.GITHUB_ACTIONS === 'true' || process.env.CF_CRON === 'true'
    if (!isCron) publishedAt = now
  } else {
    publishedAt = now
  }
  const iso = publishedAt.toISOString().replace('Z', '+07:00') // keep +07:00 readability, but ISO
  // Actually use proper ISO with offset
  const publishedIso = new Date(publishedAt).toISOString()
  // Convert to +07:00 format for display but keep ISO
  const publishedAtStr = publishedIso.replace('Z', '+07:00').replace(/\.\d+/, '')
  // But articles.json uses +07:00 offset string like "2026-09-03T07:00:00+07:00"
  // We'll construct manually
  const pad = n => String(n).padStart(2,'0')
  const d = publishedAt
  const localIso = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T07:00:00+07:00`

  const newArticle = {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    excerpt: excerpt.slice(0, 180),
    content: html,
    keywords: topic.keywords,
    category: topic.category,
    cluster: topic.cluster,
    coverImage: coverForCategory(topic.category),
    coverAlt: `${topic.title} — ilustrasi Hosp-IT`,
    author: { name: 'Tim Hosp-IT', role: topic.category === 'SatuSehat' ? 'Konsultan Regulasi & RME' : topic.category === 'RIS PACS' ? 'Spesialis RIS PACS' : topic.category === 'Medical Infra' ? 'Engineer Medical Infrastructure' : 'Konsultan Digitalisasi RS' },
    publishedAt: localIso,
    updatedAt: localIso,
    readingTime: estimateReadTime(html),
    featured: topic.priority === 'P0' && topic.id <= 6, // first 6 P0 featured
    seo: {
      metaTitle: topic.title,
      metaDescription: excerpt.slice(0, 155),
      canonicalUrl: `https://hosp-it.id/artikel/${topic.slug}`,
      ogImage: coverForCategory(topic.category),
      keywords: topic.keywords.join(', ')
    }
  }

  console.log(`\n📄 Generated article: ${newArticle.title}`)
  console.log(`   Reading time: ${newArticle.readingTime} min | Cover: ${newArticle.coverImage}`)
  console.log(`   HTML length: ${html.length} chars`)
  console.log(`   First 200 chars: ${html.slice(0,200).replace(/\n/g,' ')}...`)

  if (isDryRun) {
    console.log('\n🔍 Dry run — not writing to disk. Preview excerpt:')
    console.log(JSON.stringify(newArticle, null, 2).slice(0, 2000))
    return
  }

  // Upsert into articles.json
  const idx = articles.findIndex(a => a.slug === topic.slug)
  if (idx >= 0) {
    articles[idx] = newArticle
    console.log('♻️  Updated existing article in articles.json')
  } else {
    articles.push(newArticle)
    console.log('✨ Added new article to articles.json')
  }
  // Keep sorted by publishedAt desc for file, but we'll sort at import anyway
  articles.sort((a,b) => new Date(a.publishedAt) - new Date(b.publishedAt))

  saveJson(ARTICLES_PATH, articles)
  console.log(`💾 Saved to ${ARTICLES_PATH} (total ${articles.length} articles)`)

  // Log
  let log = []
  if (fs.existsSync(LOG_PATH)) {
    try { log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8')) } catch {}
  }
  log.unshift({
    timestamp: new Date().toISOString(),
    topicId: topic.id,
    slug: topic.slug,
    title: topic.title,
    readingTime: newArticle.readingTime,
    dryRun: isDryRun,
    aiUsed: !!(process.env.OPENAI_API_KEY || (process.env.CF_ACCOUNT_ID && process.env.CF_API_TOKEN)),
    commitSha: process.env.GITHUB_SHA || null
  })
  saveJson(LOG_PATH, log.slice(0, 100))
  console.log(`📝 Logged to ${LOG_PATH}`)

  // Regenerate sitemap
  try {
    const genSitemapPath = path.join(ROOT, 'scripts/generate-sitemap.mjs')
    if (fs.existsSync(genSitemapPath)) {
      console.log('\n🗺️  Regenerating sitemap...')
      // dynamic import
      const { generateSitemap } = await import('./generate-sitemap.mjs')
      await generateSitemap()
    }
  } catch (e) {
    console.warn('Sitemap regeneration failed (non-fatal):', e.message)
  }

  console.log('\n✅ Done! Article ready for commit & deploy.')
  console.log(`   URL will be: https://hosp-it.id/artikel/${topic.slug}`)
}

main().catch(e => {
  console.error('❌ Fatal error:', e)
  process.exit(1)
})
