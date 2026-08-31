# Hosp-IT Auto Article Cron — Deploy Guide (3-Harian)

> Auto posting artikel SEO setiap 3 hari jam 07:00 WIB untuk hosp-it.id

## ✅ Yang Sudah Selesai & Terpush

**PR**: https://github.com/HOSP-IT/hosp-it-website/pull/1  
**Fork**: https://github.com/yrchadm/hosp-it-website (branch `main`, pushed 95eefa3)

### Isi PR (sudah tested build)
- 6 artikel seed siap publish (5-7 menit baca, 1200-1800 kata, HTML + JSON-LD)
- 30 topik antrian 90 hari (`scripts/topics.config.json`)
- Generator `scripts/generate-article.mjs` (LLM-ready + fallback template)
- Sitemap dinamis + RSS (`public/sitemap.xml` 9 URLs, `public/rss.xml`)
- Routes `/artikel` & `/artikel/:slug` + Navbar + HomePage teaser
- GitHub Actions cron + Cloudflare Worker cron (redundant 2 layer)

---

## 🚀 Langkah Deploy (Butuh Akses HOSP-IT Org)

### Opsi A: Merge PR (Recommended, 1 klik)
1. Buka https://github.com/HOSP-IT/hosp-it-website/pull/1
2. Klik **Merge pull request** → **Confirm merge**
3. Cloudflare Pages akan auto-deploy (git provider = Yes) dalam 2-3 menit
4. Cek live:
   - https://hosp-it.id/artikel
   - https://hosp-it.id/artikel/apa-itu-simrs-61-modul-hosp-it-panduan-lengkap-rs-indonesia
   - https://hosp-it.id/sitemap.xml (harus 9 URLs)
   - https://hosp-it.id/rss.xml

### Opsi B: Push langsung dari local (jika owner)
```bash
# di local clone HOSP-IT/hosp-it-website
git remote add yrchadm https://github.com/yrchadm/hosp-it-website.git
git fetch yrchadm main
git merge yrchadm/main --no-edit
git push origin main
```

---

## 🔐 Setup Secrets (Optional tapi recommended untuk kualitas AI terbaik)

Tanpa secrets pun cron tetap jalan pakai fallback template (kualitas tetap SEO, sudah curated). Dengan secrets, artikel jadi lebih variatif via LLM.

### Di GitHub: Settings → Secrets → Actions
| Key | Isi | Dari mana |
|-----|-----|-----------|
| `OPENAI_API_KEY` | sk-... | https://platform.openai.com/api-keys |
| `CF_ACCOUNT_ID` | 597dff29555eb48c06d2b7bcc542dc23 | Cloudflare Dashboard → Account |
| `CF_API_TOKEN` | token Workers AI | Cloudflare → My Profile → API Tokens (template: Workers AI) |

Jika salah satu diisi, `generate-article.mjs` akan pakai LLM. Prioritas: OpenAI > Cloudflare AI > fallback.

### Di Cloudflare Worker (fallback cron)
```bash
cd workers/article-cron
npx wrangler secret put GITHUB_TOKEN
# paste PAT dengan scope repo + workflow (github.com/settings/tokens)
npx wrangler deploy
# cek health
curl https://hosp-it-article-cron.<your-subdomain>.workers.dev/health
curl https://hosp-it-article-cron.<your-subdomain>.workers.dev/next-topic
# trigger manual
curl https://hosp-it-article-cron.<your-subdomain>.workers.dev/trigger
```

---

## 🧪 Test Manual Cron

### Via GitHub Actions
1. Go to **Actions** → **Hosp-IT Agentic Article Cron**
2. **Run workflow** → pilih `topic_id` (opsional, kosongkan untuk auto next) → `dry_run: false` → Run
3. Lihat **Summary** + logs, cek `src/data/articles.json` bertambah

### Via Local
```bash
# lihat antrian
npm run topics
# preview artikel berikutnya (tidak nulis)
npm run generate:article:dry
# generate beneran (nulis ke articles.json + sitemap/rss)
npm run generate:article
# force topik tertentu
node scripts/generate-article.mjs --topic-id 7
node scripts/generate-article.mjs --topic-id 7 --dry-run
```

### Via Worker HTTP
```bash
curl https://hosp-it-article-cron.workers.dev/trigger?topic=7
```

---

## 📅 Timeline 90 Hari (3-harian)

| Tgl | Topik |
|-----|-------|
| 2026-09-03 | #1 SIMRS 61 modul ✅ |
| 2026-09-06 | #2 SatuSehat PMK24 ✅ |
| 2026-09-09 | #3 RIS PACS Mini/Plus/Pro ✅ |
| 2026-09-12 | #4 MOT vs Konvensional ✅ |
| 2026-09-15 | #5 Bridging BPJS ✅ |
| 2026-09-18 | #6 Harga Lumpsum vs KSO ✅ |
| 2026-09-21 | #7 8 FHIR Resources ⏳ NEXT |
| 2026-09-24 | #8 Hermetic Door |
| ... | ... s.d. 2026-11-29 (#30 Katalog 113 produk) |

Lengkap ada di `scripts/topics.config.json`.

---

## 🔍 SEO Checklist Setelah Merge

- [ ] `https://hosp-it.id/sitemap.xml` submit di Google Search Console (GSC) → Sitemaps → Add
- [ ] GSC → URL Inspection → test `/artikel` & 1 detail
- [ ] GSC → Request Indexing untuk 6 artikel seed
- [ ] Cek `robots.txt` allow + sitemap ref
- [ ] Lighthouse SEO > 90 (sudah ada meta, OG, JSON-LD)
- [ ] Share 1 artikel ke LinkedIn RS / grup WA direktur RS untuk trafik awal

---

## 🛠️ Maintenance

- Tambah topik baru: edit `scripts/topics.config.json` → push → cron akan pick otomatis
- Edit artikel: edit langsung `src/data/articles.json` (field `content` HTML) → commit → deploy
- Ganti jadwal cron: edit `.github/workflows/cron-article.yml` line `cron: '0 0 */3 * *'` dan `workers/article-cron/wrangler.toml` `[triggers] crons`
- Monitoring: Actions → cron history, atau Worker `/health`

---

## 📂 File Penting

```
src/data/articles.json            # database artikel (6 seed, akan nambah tiap 3 hari)
src/data/articles.ts              # helper getArticleBySlug etc
scripts/topics.config.json        # 30 topik queue
scripts/generate-article.mjs      # generator utama
scripts/generate-sitemap.mjs      # sitemap builder
scripts/generate-rss.mjs          # RSS builder
workers/article-cron/             # CF Worker fallback
.github/workflows/cron-article.yml
src/pages/ArtikelListPage.tsx
src/pages/ArtikelDetailPage.tsx
src/components/ArticleCard.tsx
```

---

## ❓ Butuh Bantuan?

- PR review: https://github.com/HOSP-IT/hosp-it-website/pull/1
- Local repo dengan semua changes: `C:\Users\Lenovo\AppData\Local\Temp\hosp-it-website`
- WA Hosp-IT bot sudah terintegrasi di setiap CTA artikel

**Next action Anda**: Merge PR #1. Setelah itu auto-cron jalan sendiri tanpa sentuh apa pun.
