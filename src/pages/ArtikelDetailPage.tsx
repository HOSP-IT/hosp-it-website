import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Navbar from '../sections/Navbar'
import Footer from '../sections/Footer'
import ArticleCard from '@/components/ArticleCard'
import { getArticleBySlug, getRelatedArticles, CATEGORY_COLOR } from '@/data/articles'
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo'
import { Calendar, Clock, User, Share2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ArtikelDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

  if (!article) {
    return <Navigate to="/artikel" replace />
  }

  const related = getRelatedArticles(article.slug, 3)

  // Dynamic SEO - update document head
  useEffect(() => {
    document.title = `${article.seo.metaTitle} | Hosp-IT`
    
    // meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', article.seo.metaDescription)

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = article.seo.canonicalUrl

    // og tags
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.content = content
    }
    setMeta('og:title', article.title)
    setMeta('og:description', article.excerpt)
    setMeta('og:url', article.seo.canonicalUrl)
    setMeta('og:image', `https://hosp-it.id${article.coverImage}`)
    setMeta('og:type', 'article')

    // Article JSON-LD
    const existingJsonLd = document.getElementById('article-jsonld')
    if (existingJsonLd) existingJsonLd.remove()
    const script = document.createElement('script')
    script.id = 'article-jsonld'
    script.type = 'application/ld+json'
    script.text = JSON.stringify(generateArticleJsonLd(article))
    document.head.appendChild(script)

    const breadcrumbScript = document.createElement('script')
    breadcrumbScript.id = 'breadcrumb-jsonld'
    breadcrumbScript.type = 'application/ld+json'
    breadcrumbScript.text = JSON.stringify(generateBreadcrumbJsonLd(article.title, article.slug))
    const prevBreadcrumb = document.getElementById('breadcrumb-jsonld')
    if (prevBreadcrumb) prevBreadcrumb.remove()
    document.head.appendChild(breadcrumbScript)

    return () => {
      // cleanup not needed - will be replaced on next mount
    }
  }, [article])

  const handleShare = async () => {
    const url = `https://hosp-it.id/artikel/${article.slug}`
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.excerpt, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link disalin!')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <div className="pt-24 pb-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-[#64748B] hover:text-[#0A6E7C]">Beranda</Link>
              <span className="text-[#CBD5E1]">/</span>
              <Link to="/artikel" className="text-[#64748B] hover:text-[#0A6E7C]">Artikel</Link>
              <span className="text-[#CBD5E1]">/</span>
              <span className="text-[#0A6E7C] font-medium truncate">{article.category}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <article>
          <header className="py-10 bg-[#F8FAFC]">
            <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Link to="/artikel" className="inline-flex items-center gap-2 text-sm font-medium text-[#0A6E7C] hover:gap-3 transition-all mb-6">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Artikel
                </Link>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${CATEGORY_COLOR[article.category]}`}>{article.category}</span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B]">{article.cluster}</span>
                  {article.featured && <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#00C9B7] text-white">Featured</span>}
                </div>

                <h1 className="heading-2 text-[#1E293B] leading-tight mb-4">
                  {article.title}
                </h1>

                <p className="text-lg text-[#64748B] leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E2E8F0]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A6E7C] to-[#00C9B7] flex items-center justify-center text-white font-bold text-sm">
                      {article.author.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1E293B]">
                        <User className="w-4 h-4 text-[#0A6E7C]" /> {article.author.name}
                      </div>
                      <div className="text-xs text-[#94A3B8]">{article.author.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#64748B]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.readingTime} menit baca</span>
                    <button onClick={handleShare} className="ml-2 p-2 rounded-full bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0A6E7C] transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Cover */}
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto -mt-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img src={article.coverImage} alt={article.coverAlt} className="w-full h-[380px] md:h-[460px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_280px] gap-10">
                {/* Article Body */}
                <div
                  className="prose prose-slate max-w-none prose-headings:text-[#1E293B] prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-p:text-[#334155] prose-p:leading-relaxed prose-a:text-[#0A6E7C] prose-a:font-semibold prose-strong:text-[#1E293B] prose-ul:text-[#334155] prose-li:marker:text-[#0A6E7C] prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-[#00C9B7] prose-blockquote:bg-[#F8FAFC] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Sidebar */}
                <aside className="space-y-6">
                  {/* CTA Card */}
                  <div className="sticky top-24 space-y-6">
                    <div className="rounded-2xl bg-gradient-to-br from-[#0A1628] to-[#0A6E7C] p-6 text-white">
                      <h3 className="font-bold text-lg mb-2">Butuh solusi untuk RS Anda?</h3>
                      <p className="text-white/70 text-sm mb-4 leading-relaxed">Konsultasi gratis 30 menit dengan tim Hosp-IT. Dapatkan rekomendasi SIMRS, RIS PACS, atau infra yang paling pas.</p>
                      <a
                        href={`https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20baca%20artikel%20%22${encodeURIComponent(article.title)}%22%20dan%20ingin%20konsultasi`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-white w-full justify-center text-sm"
                      >
                        Konsultasi via WhatsApp
                      </a>
                      <p className="text-white/50 text-xs text-center mt-3">Respon &lt; 2 jam kerja</p>
                    </div>

                    {/* TOC-ish / Keywords */}
                    <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-5">
                      <h4 className="font-bold text-[#1E293B] mb-3 text-sm">Topik Terkait</h4>
                      <div className="flex flex-wrap gap-2">
                        {article.keywords.map(kw => (
                          <span key={kw} className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#475569]">{kw}</span>
                        ))}
                      </div>
                    </div>

                    {/* Quick facts */}
                    <div className="rounded-xl bg-white border border-[#E2E8F0] p-5">
                      <h4 className="font-bold text-[#1E293B] mb-3 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#10B981]" /> Ringkas Artikel</h4>
                      <ul className="space-y-2 text-sm text-[#475569]">
                        <li>• Kategori: <strong>{article.category}</strong></li>
                        <li>• Waktu baca: <strong>{article.readingTime} menit</strong></li>
                        <li>• Update: {new Date(article.updatedAt).toLocaleDateString('id-ID')}</li>
                        <li>• Penulis: {article.author.name}</li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
            <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="heading-3 text-[#1E293B] mb-8">Artikel Terkait</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {related.map(a => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
                <div className="text-center mt-10">
                  <Link to="/artikel" className="btn-outline">Lihat Semua Artikel</Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
