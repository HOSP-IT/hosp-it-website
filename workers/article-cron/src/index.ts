/**
 * Hosp-IT Agentic AI Cron Worker
 * - Runs every 3 days via Cloudflare Cron Triggers (00:00 UTC = 07:00 WIB)
 * - Also callable via HTTP: GET /trigger, GET /health, GET /next-topic
 * - Uses Workers AI (Llama 3.3) to generate article HTML
 * - Commits to GitHub via GitHub API (creates/updates src/data/articles.json + triggers rebuild)
 * - Falls back to template if AI not available
 *
 * Setup:
 *   npx wrangler secret put GITHUB_TOKEN
 *   npx wrangler deploy
 *
 * Env:
 *   AI - Workers AI binding
 *   GITHUB_TOKEN - PAT with repo & workflow scopes
 */

interface Env {
  AI: any
  GITHUB_TOKEN: string
  SITE_URL?: string
  GITHUB_REPO?: string
  GITHUB_BRANCH?: string
  OPENAI_API_KEY?: string
  CF_ACCOUNT_ID?: string
  CF_API_TOKEN?: string
}

// Topics mirrored from scripts/topics.config.json (30 topics)
// For reliability, worker has embedded copy + also fetches from GitHub raw if possible
const TOPICS: Array<{
  id: number; slug: string; title: string; keywords: string[]; category: string; cluster: string; scheduledDate: string; priority: string
}> = [
  { id: 1, slug: "apa-itu-simrs-61-modul-hosp-it-panduan-lengkap-rs-indonesia", title: "Apa Itu SIMRS 61 Modul Hosp-IT? Panduan Lengkap untuk RS Indonesia 2026", keywords: ["SIMRS", "sistem informasi rumah sakit", "SIMRS 61 modul", "SIMRS terbaik Indonesia"], category: "SIMRS", cluster: "SIMRS Core", scheduledDate: "2026-09-03", priority: "P0" },
  { id: 2, slug: "integrasi-satusehat-kemenkes-pmk-24-2022-wajib-rme", title: "Integrasi SatuSehat Kemenkes: Kewajiban PMK 24/2022 & Sanksi RS Belum Terhubung", keywords: ["SatuSehat", "integrasi SatuSehat", "PMK 24 2022", "RME wajib"], category: "SatuSehat", cluster: "Regulasi & Compliance", scheduledDate: "2026-09-06", priority: "P0" },
  { id: 3, slug: "ris-pacs-dicom-30-perbedaan-mini-plus-pro-untuk-rs", title: "RIS PACS DICOM 3.0: Perbedaan Paket Mini, Plus & Pro — Mana yang Cocok untuk RS Anda?", keywords: ["RIS PACS", "DICOM 3.0", "PACS RS", "radiologi digital"], category: "RIS PACS", cluster: "Radiologi Digital", scheduledDate: "2026-09-09", priority: "P0" },
  { id: 4, slug: "modular-operating-theatre-mot-vs-konvensional-7-keunggulan", title: "Modular Operating Theatre (MOT) vs Kamar Operasi Konvensional: 7 Keunggulan Utama", keywords: ["modular operating theatre", "MOT rumah sakit", "kamar operasi modular"], category: "Medical Infra", cluster: "Infrastructure", scheduledDate: "2026-09-12", priority: "P0" },
  { id: 5, slug: "bridging-bpjs-vclaim-eklaim-antrol-simrs-hosp-it", title: "Bridging BPJS di SIMRS Hosp-IT: VClaim, E-Klaim & Antrol dalam Satu Sistem", keywords: ["bridging BPJS", "VClaim", "E-Klaim INA-CBG", "Antrol BPJS"], category: "BPJS", cluster: "BPJS Bridging", scheduledDate: "2026-09-15", priority: "P0" },
  { id: 6, slug: "harga-simrs-2026-lumpsum-vs-kso-untuk-rs-tipe-c-b", title: "Harga SIMRS 2026: Skema Lumpsum vs KSO untuk RS Tipe C & B (Studi Kasus)", keywords: ["harga SIMRS", "biaya SIMRS", "SIMRS KSO", "SIMRS lumpsum"], category: "SIMRS", cluster: "Pricing", scheduledDate: "2026-09-18", priority: "P0" },
  { id: 7, slug: "8-fhir-resources-wajib-satusehat-encounter-hingga-allergy", title: "8 FHIR Resources Wajib Kirim ke SatuSehat: Encounter hingga AllergyIntolerance", keywords: ["FHIR resources", "HL7 FHIR R4", "SatuSehat bridging"], category: "SatuSehat", cluster: "Teknis", scheduledDate: "2026-09-21", priority: "P1" },
  { id: 8, slug: "hermetic-door-rs-spesifikasi-untuk-ot-icu-linac", title: "Hermetic Door untuk RS: Spesifikasi Kedap Udara untuk OT, ICU & Ruang Linac", keywords: ["hermetic door", "pintu hermetic RS", "pintu OT hermetic"], category: "Medical Infra", cluster: "Infrastructure", scheduledDate: "2026-09-24", priority: "P1" },
  { id: 9, slug: "filmless-radiologi-hemat-60-persen-dengan-pacs-hosp-it", title: "Filmless Radiologi: Hitung Hemat 60% Biaya Film dengan PACS Hosp-IT", keywords: ["filmless radiologi", "hemat biaya PACS", "PACS filmless"], category: "RIS PACS", cluster: "ROI", scheduledDate: "2026-09-27", priority: "P1" },
  { id: 10, slug: "simrs-cloud-vs-on-premise-mana-lebih-aman-untuk-rs", title: "SIMRS Cloud vs On-Premise: Mana Lebih Aman untuk Data Pasien RS?", keywords: ["SIMRS cloud", "SIMRS on premise", "keamanan SIMRS"], category: "SIMRS", cluster: "Keamanan", scheduledDate: "2026-09-30", priority: "P1" },
  { id: 11, slug: "medical-gas-system-instalasi-o2-n2o-vacuum-alarm-rs", title: "Medical Gas System: Standar Instalasi O2, N2O & Vacuum + Alarm untuk RS Tipe C/B", keywords: ["medical gas RS", "instalasi gas medis", "alarm medical gas"], category: "Medical Infra", cluster: "Infrastructure", scheduledDate: "2026-10-03", priority: "P1" },
  { id: 12, slug: "cara-implementasi-simrs-90-hari-tanpa-ganggu-operasional", title: "Cara Implementasi SIMRS 90 Hari Tanpa Ganggu Operasional RS — Timeline Hosp-IT", keywords: ["implementasi SIMRS", "go-live SIMRS", "timeline SIMRS"], category: "SIMRS", cluster: "Implementasi", scheduledDate: "2026-10-06", priority: "P1" },
  { id: 13, slug: "nurse-call-system-aiphone-vs-wireless-vs-ip-dect-untuk-rs", title: "Nurse Call System: Aiphone vs Wireless vs IP DECT — Mana Cocok untuk RS 100-300 Bed?", keywords: ["nurse call system", "nurse call RS", "Aiphone nurse call"], category: "Medical Infra", cluster: "Infrastructure", scheduledDate: "2026-10-09", priority: "P1" },
  { id: 14, slug: "teleradiologi-24-jam-kirim-ct-mri-antar-rs-tanpa-kurir-film", title: "Teleradiologi 24 Jam: Kirim CT/MRI Antar RS Tanpa Kurir Film dengan RIS PACS", keywords: ["teleradiologi", "teleradiografi", "RIS PACS teleradiologi"], category: "RIS PACS", cluster: "Radiologi", scheduledDate: "2026-10-12", priority: "P1" },
  { id: 15, slug: "simrs-ekatalog-lkpp-panduan-pengadaan-rsud-2026", title: "SIMRS e-Katalog LKPP: Panduan Pengadaan RSUD Langkah-demi-Langkah 2026", keywords: ["SIMRS e-katalog", "LKPP SIMRS", "pengadaan SIMRS RSUD"], category: "SIMRS", cluster: "Pengadaan", scheduledDate: "2026-10-15", priority: "P1" },
  { id: 16, slug: "ctr-cardiothoracic-ratio-otomatis-di-pacs-hosp-it", title: "CTR Cardiothoracic Ratio Otomatis di PACS Hosp-IT: Diagnosis Jantung Lebih Cepat", keywords: ["CTR PACS", "cardiothoracic ratio", "PACS otomatis"], category: "RIS PACS", cluster: "Fitur AI", scheduledDate: "2026-10-18", priority: "P2" },
  { id: 17, slug: "vinyl-gerflor-insulated-panel-pir-syarat-ruang-bersih-rs", title: "Vinyl Gerflor & Insulated Panel PIR: Syarat Lantai-Dinding Ruang Bersih RS Sesuai Standar", keywords: ["vinyl Gerflor RS", "insulated panel PIR", "ruang bersih RS"], category: "Medical Infra", cluster: "Material", scheduledDate: "2026-10-21", priority: "P2" },
  { id: 18, slug: "antrean-online-bpjs-antrol-mobile-jkn-integrasi-simrs", title: "Antrean Online BPJS & Antrol Mobile JKN: Integrasi Display Anjungan di SIMRS Hosp-IT", keywords: ["antrean online BPJS", "Antrol", "Mobile JKN SIMRS"], category: "BPJS", cluster: "Pasien Experience", scheduledDate: "2026-10-24", priority: "P2" },
  { id: 19, slug: "snars-simrs-modul-pmkp-ppi-rl-untuk-akreditasi-rs", title: "SNARS & SIMRS: Modul PMKP, PPI & RL1-RL5 yang Wajib Ada untuk Akreditasi RS", keywords: ["SNARS SIMRS", "PMKP PPI", "RL SIMRS akreditasi"], category: "SIMRS", cluster: "Akreditasi", scheduledDate: "2026-10-27", priority: "P2" },
  { id: 20, slug: "hitung-roi-kapan-investasi-simrs-990-juta-balik-modal", title: "Hitung ROI: Kapan Investasi SIMRS 990 Juta Balik Modal? (Kalkulator RS 100 Bed)", keywords: ["ROI SIMRS", "investasi SIMRS", "balik modal SIMRS"], category: "SIMRS", cluster: "ROI", scheduledDate: "2026-10-30", priority: "P2" },
  { id: 21, slug: "kfa-satusehat-standarisasi-kode-obat-farmasi-eprescribing", title: "KFA di SatuSehat: Standarisasi Kode Obat Farmasi & e-Prescribing di SIMRS", keywords: ["KFA SatuSehat", "kode obat SatuSehat", "e-prescribing"], category: "SatuSehat", cluster: "Farmasi", scheduledDate: "2026-11-02", priority: "P2" },
  { id: 22, slug: "studi-kasus-30-rs-jawa-bali-sumatera-kalimantan-pakai-hosp-it", title: "Studi Kasus: 30+ RS di Jawa, Bali, Sumatera & Kalimantan yang Percaya Hosp-IT", keywords: ["portofolio Hosp-IT", "RS pakai Hosp-IT", "referensi SIMRS"], category: "Portofolio", cluster: "Social Proof", scheduledDate: "2026-11-05", priority: "P2" },
  { id: 23, slug: "ceiling-pendant-surgical-340-derajat-untuk-kamar-operasi-modern", title: "Ceiling Pendant Surgical 340°: Solusi Ergonomis untuk Kamar Operasi Modern", keywords: ["ceiling pendant RS", "pendant operasi", "ceiling pendant 340"], category: "Medical Infra", cluster: "OT Equipment", scheduledDate: "2026-11-08", priority: "P2" },
  { id: 24, slug: "zero-input-ganda-auto-bridging-rme-satusehat-tanpa-entry-2x", title: "Zero Input Ganda: Cara Hosp-IT Auto-Bridging RME ke SatuSehat Tanpa Entry 2 Kali", keywords: ["zero input SatuSehat", "auto bridging", "RME SatuSehat"], category: "SatuSehat", cluster: "Otomasi", scheduledDate: "2026-11-11", priority: "P2" },
  { id: 25, slug: "hosp-it-vs-kompetitor-adu-61-vs-24-modul-tabel-2026", title: "Hosp-IT vs Kompetitor: Adu 61 vs 24 Modul, Harga, FHIR & Garansi (Tabel 2026)", keywords: ["perbandingan SIMRS", "Hosp-IT vs", "SIMRS terbaik 2026"], category: "SIMRS", cluster: "Komparasi", scheduledDate: "2026-11-14", priority: "P2" },
  { id: 26, slug: "scrub-sink-pass-box-sus304-uv-sterilisasi-untuk-ot-steril", title: "Scrub Sink & Pass Box SUS304 dengan UV Sterilisasi untuk OT Steril", keywords: ["scrub sink RS", "pass box RS", "SUS304 OT"], category: "Medical Infra", cluster: "OT Steril", scheduledDate: "2026-11-17", priority: "P3" },
  { id: 27, slug: "kesalahan-klaim-ina-cbg-bikin-pending-cara-cek-di-eklaim", title: "5 Kesalahan Klaim INA-CBG yang Bikin Pending & Cara Cek Cepat di E-Klaim", keywords: ["klaim INA-CBG", "E-Klaim pending", "kesalahan klaim BPJS"], category: "BPJS", cluster: "Klaim", scheduledDate: "2026-11-20", priority: "P3" },
  { id: 28, slug: "dicom-viewer-browser-based-vs-workstation-keamanan-kolaborasi", title: "DICOM Viewer Browser-Based vs Workstation: Keamanan & Kolaborasi Radiologi", keywords: ["DICOM viewer", "browser DICOM", "viewer PACS"], category: "RIS PACS", cluster: "Teknologi", scheduledDate: "2026-11-23", priority: "P3" },
  { id: 29, slug: "demo-gratis-simrs-hosp-it-apa-yang-didapat-assessment-2-jam", title: "Demo Gratis SIMRS Hosp-IT: Apa yang Didapat di Assessment 2 Jam?", keywords: ["demo SIMRS", "assessment SIMRS", "konsultasi SIMRS gratis"], category: "SIMRS", cluster: "CTA", scheduledDate: "2026-11-26", priority: "P3" },
  { id: 30, slug: "katalog-113-produk-hosp-it-daftar-harga-indikatif-medical-infra-2026", title: "Katalog 113 Produk Hosp-IT: Daftar Lengkap & Harga Indikatif Medical Infra 2026", keywords: ["katalog Hosp-IT", "113 produk", "medical infra katalog"], category: "Medical Infra", cluster: "Katalog", scheduledDate: "2026-11-29", priority: "P3" },
];

function systemPrompt(topic: typeof TOPICS[0]) {
  return `Kamu adalah Senior Content Strategist Hosp-IT (One-Stop Hospital Solution Indonesia). Produk: SIMRS 61 modul, RIS PACS DICOM 3.0, 113+ Medical Infra. Tone: Profesional, edukatif, Bahasa Indonesia. Tulis artikel SEO 1200-1800 kata untuk "${topic.title}" keywords: ${topic.keywords.join(', ')}. Output HARUS HTML murni (<p><h2><h3><ul><ol><blockquote><table><a><strong><em>) tanpa markdown atau \`\`\`. Minimal 5 heading, 1 tabel/blockquote, 2 internal link ke hosp-it.id, 1 CTA WA https://wa.me/6285111244364 . Jangan halusinasi regulasi.`;
}

function fallbackHTML(topic: typeof TOPICS[0]): string {
  return `<p><strong>${topic.title}</strong> — panduan praktis untuk direktur & IT RS Indonesia. Hosp-IT (SIMRS 61 modul, RIS PACS DICOM 3.0, 113+ Medical Infra) merangkum <em>${topic.keywords.join(', ')}</em> agar RS bisa compliance & efisien dalam 90 hari go-live.</p>
<h2>Kenapa Penting di 2026?</h2>
<p>Regulasi SatuSehat (PMK 24/2022, SE 1030/2023, UU 17/2023) dan tekanan klaim BPJS menuntut RS memiliki sistem terintegrasi. RS yang masih manual kehilangan 2–3 bulan produktivitas akibat input ganda & pending.</p>
<blockquote><p>Satu Mitra, Satu Tanggung Jawab — Hosp-IT kelola software + radiologi + infra fisik dalam satu paket.</p></blockquote>
<h2>Pembahasan Utama</h2>
<p>Untuk <strong>${topic.keywords[0]}</strong>, Hosp-IT mulai dari assessment gratis (bed, poli, modalitas), lalu rekomendasikan skema <strong>Lumpsum (source milik RS)</strong> atau <strong>KSO tanpa capex</strong> via <a href="https://hosp-it.id/integrasi-satusehat">e-Katalog LKPP</a>.</p>
<h3>Checklist Implementasi</h3>
<ul><li>Audit RME 100% + e-signature</li><li>Cek FHIR R4 & bridging SatuSehat</li><li>Hitung ROI filmless/PACS vs film</li><li>Jadwalkan assessment 90 hari</li></ul>
<h2>Perbandingan</h2>
<table><thead><tr><th>Aspek</th><th>Sebelum</th><th>Sesudah Hosp-IT</th></tr></thead><tbody><tr><td>Bridging SatuSehat</td><td>Manual</td><td>Auto HL7 FHIR real-time</td></tr><tr><td>Klaim BPJS</td><td>Pending 12-18%</td><td>&lt;5% (validasi native)</td></tr><tr><td>Lisensi</td><td>Per-client</td><td>Unlimited, browser-based</td></tr></tbody></table>
<p>Mau simulasi untuk RS Anda? <a href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20baca%20${encodeURIComponent(topic.title)}%20ingin%20konsultasi">Konsultasi gratis WA</a> — respon &lt;2 jam kerja. Lihat juga <a href="https://hosp-it.id/integrasi-satusehat">SatuSehat Ready Hosp-IT</a>.</p>`;
}

async function generateWithAI(AI: any, topic: typeof TOPICS[0]): Promise<string> {
  const prompt = `Buatkan artikel HTML final untuk ID ${topic.id}: "${topic.title}" (slug ${topic.slug}, keywords ${topic.keywords.join(', ')}, kategori ${topic.category}). 1200-1800 kata, HTML saja.`;
  try {
    const result: any = await AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: systemPrompt(topic) },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
    });
    const text = result?.response || result?.output || result?.text || "";
    if (text && text.length > 500) return text;
    console.warn("AI response too short or empty, using fallback");
    return fallbackHTML(topic);
  } catch (e: any) {
    console.warn("AI failed:", e.message);
    return fallbackHTML(topic);
  }
}

function coverForCategory(cat: string): string {
  const m: Record<string,string> = {
    'SIMRS': '/images/product-simrs.jpg',
    'RIS PACS': '/images/product-rispacs.jpg',
    'Medical Infra': '/images/product-infra.jpg',
    'SatuSehat': '/images/hero-satusehat.jpg',
    'BPJS': '/images/product-simrs.jpg',
    'Portofolio': '/images/product-infra.jpg',
  };
  return m[cat] || '/images/hero-main.jpg';
}

async function getPublishedSlugs(repo: string, branch: string, token: string): Promise<Set<string>> {
  try {
    const url = `https://raw.githubusercontent.com/${repo}/${branch}/src/data/articles.json`;
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) throw new Error(`fetch articles.json ${res.status}`);
    const data: any[] = await res.json();
    return new Set(data.map((a:any) => a.slug));
  } catch (e: any) {
    console.warn("Failed to fetch articles.json from GitHub:", e.message, "=> assume none published");
    return new Set();
  }
}

async function getArticlesJson(repo: string, branch: string, token: string): Promise<{ data: any[], sha: string | null }> {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/src/data/articles.json?ref=${branch}`;
  const res = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'hosp-it-cron' }
  });
  if (res.status === 404) return { data: [], sha: null };
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub GET articles.json failed ${res.status}: ${t.slice(0,400)}`);
  }
  const j: any = await res.json();
  const content = atob(j.content.replace(/\n/g, ''));
  return { data: JSON.parse(content), sha: j.sha };
}

async function commitArticle(
  repo: string, branch: string, token: string,
  articles: any[], prevSha: string | null, topic: typeof TOPICS[0], html: string
): Promise<void> {
  // Build new article
  const pad = (n:number)=> String(n).padStart(2,'0');
  const d = new Date();
  const localIso = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T07:00:00+07:00`;
  const textLen = html.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(4, Math.ceil(textLen/200));
  const cover = coverForCategory(topic.category);
  const excerpt = `Panduan praktis ${topic.title.toLowerCase()} untuk RS Indonesia. ${topic.keywords.slice(0,3).join(', ')} — insight Hosp-IT (90 hari go-live, SatuSehat & BPJS ready).`;

  const newArticle = {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    excerpt: excerpt.slice(0,180),
    content: html,
    keywords: topic.keywords,
    category: topic.category,
    cluster: topic.cluster,
    coverImage: cover,
    coverAlt: `${topic.title} — ilustrasi Hosp-IT`,
    author: { name: "Tim Hosp-IT", role: topic.category==="SatuSehat"?"Konsultan Regulasi & RME":topic.category==="RIS PACS"?"Spesialis RIS PACS":topic.category==="Medical Infra"?"Engineer Medical Infrastructure":"Konsultan Digitalisasi RS" },
    publishedAt: localIso,
    updatedAt: localIso,
    readingTime,
    featured: topic.priority==="P0" && topic.id<=6,
    seo: {
      metaTitle: topic.title,
      metaDescription: excerpt.slice(0,155),
      canonicalUrl: `https://hosp-it.id/artikel/${topic.slug}`,
      ogImage: cover,
      keywords: topic.keywords.join(', ')
    }
  };

  const idx = articles.findIndex((a:any)=> a.slug===topic.slug);
  if (idx>=0) articles[idx]=newArticle; else articles.push(newArticle);
  articles.sort((a:any,b:any)=> new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());

  const newContent = JSON.stringify(articles, null, 2) + "\n";
  const base64 = btoa(unescape(encodeURIComponent(newContent)));

  // Also need to update sitemap? We'll let build generate it, but we can also commit public/sitemap.xml for immediate effect
  // Commit articles.json
  const putUrl = `https://api.github.com/repos/${repo}/contents/src/data/articles.json`;
  const body: any = {
    message: `feat(artikel): auto post #${topic.id} — ${topic.title} [cron]`,
    content: base64,
    branch,
  };
  if (prevSha) body.sha = prevSha;

  const res = await fetch(putUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'hosp-it-cron', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub PUT failed ${res.status}: ${t.slice(0,600)}`);
  }
  console.log(`✅ Committed articles.json for topic #${topic.id}`);
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log("⏰ Cron triggered at", new Date().toISOString(), "cron:", event.cron);
    ctx.waitUntil(handleCron(env, "cron"));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS helper
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    if (path === "/health") {
      return new Response(JSON.stringify({ ok: true, service: "hosp-it-article-cron", time: new Date().toISOString(), cron: "0 0 */3 * * (07:00 WIB)", nextTopics: TOPICS.slice(0,3).map(t=>t.slug) }, null, 2), { headers: { "Content-Type": "application/json", ...cors } });
    }

    if (path === "/next-topic") {
      const repo = env.GITHUB_REPO || "HOSP-IT/hosp-it-website";
      const branch = env.GITHUB_BRANCH || "main";
      const token = env.GITHUB_TOKEN;
      if (!token) return new Response(JSON.stringify({ error: "GITHUB_TOKEN not set" }), { status: 500, headers: cors });
      const published = await getPublishedSlugs(repo, branch, token);
      const pending = TOPICS.filter(t=> !published.has(t.slug)).sort((a,b)=> new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
      return new Response(JSON.stringify({ published: published.size, total: TOPICS.length, next: pending[0] || null, pending: pending.slice(0,5) }, null, 2), { headers: { "Content-Type": "application/json", ...cors } });
    }

    if (path === "/trigger" || path === "/cron" || path === "/generate") {
      // Optional auth: check ?token=xxx equals GITHUB_TOKEN last 6 chars? Or allow open but rate-limit
      // For now allow, but require ?force maybe
      const forceTopic = url.searchParams.get("topic") || url.searchParams.get("id");
      try {
        const result = await handleCron(env, "http", forceTopic);
        return new Response(JSON.stringify(result, null, 2), { headers: { "Content-Type": "application/json", ...cors } });
      } catch (e:any) {
        return new Response(JSON.stringify({ ok: false, error: e.message, stack: e.stack?.slice(0,2000) }, null, 2), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
      }
    }

    return new Response(`
<h1>Hosp-IT Article Cron</h1>
<p>Endpoints:</p>
<ul>
  <li><a href="/health">/health</a> — status</li>
  <li><a href="/next-topic">/next-topic</a> — next topic in queue</li>
  <li><a href="/trigger">/trigger</a> — manually trigger generation (add ?topic=ID or ?topic=slug)</li>
</ul>
<p>Cron: 0 0 */3 * * (every 3 days 07:00 WIB)</p>
    `, { headers: { "Content-Type": "text/html", ...cors } });
  }
};

async function handleCron(env: Env, source: string, forceTopic?: string | null): Promise<any> {
  const repo = env.GITHUB_REPO || "HOSP-IT/hosp-it-website";
  const branch = env.GITHUB_BRANCH || "main";
  const token = env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set — add via wrangler secret put GITHUB_TOKEN");

  const AI = env.AI;
  console.log(`🚀 handleCron source=${source} repo=${repo} branch=${branch} force=${forceTopic||"-"}`);

  // Determine next topic
  const published = await getPublishedSlugs(repo, branch, token);
  console.log(`📊 Published: ${published.size}/${TOPICS.length}`);

  let topic: typeof TOPICS[0] | undefined;
  if (forceTopic) {
    topic = TOPICS.find(t=> String(t.id)===forceTopic || t.slug===forceTopic);
    if (!topic) throw new Error(`Topic ${forceTopic} not found`);
  } else {
    const pending = TOPICS.filter(t=> !published.has(t.slug)).sort((a,b)=> new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    if (pending.length===0) {
      console.log("🎉 All topics published");
      return { ok: true, message: "All topics published", published: published.size, total: TOPICS.length };
    }
    // Enforce schedule: only publish if scheduledDate <= today (so cron respects 3-day cadence)
    // If multiple pending with past dates, publish one per run
    const today = new Date().toISOString().slice(0,10);
    const due = pending.filter(t=> t.scheduledDate <= today);
    topic = due.length>0 ? due[0] : pending[0]; // if cron runs early, still publish next to catch up
    console.log(`📅 Today ${today}, due: ${due.length}, picking #${topic.id} scheduled ${topic.scheduledDate}`);
  }

  // Generate content
  let html: string;
  if (AI) {
    html = await generateWithAI(AI, topic);
  } else {
    console.warn("No AI binding — using fallback");
    html = fallbackHTML(topic);
  }

  // Commit to GitHub
  const { data: articles, sha } = await getArticlesJson(repo, branch, token);
  await commitArticle(repo, branch, token, articles, sha, topic, html);

  // Also trigger Pages rebuild implicitly via push; we can also dispatch workflow via API if needed
  // Try to trigger GitHub Actions workflow (optional)
  try {
    await fetch(`https://api.github.com/repos/${repo}/actions/workflows/cron-article.yml/dispatches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'hosp-it-cron' },
      body: JSON.stringify({ ref: branch })
    });
  } catch {}

  return {
    ok: true,
    source,
    topic: { id: topic.id, slug: topic.slug, title: topic.title, category: topic.category },
    url: `https://hosp-it.id/artikel/${topic.slug}`,
    published: published.size + 1,
    total: TOPICS.length,
    timestamp: new Date().toISOString()
  };
}
