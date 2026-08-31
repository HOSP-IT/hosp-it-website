import { useState, useMemo } from 'react'
import Navbar from '../sections/Navbar'
import Footer from '../sections/Footer'
import ArticleCard from '@/components/ArticleCard'
import { getAllArticles, getCategories, type Article } from '@/data/articles'
import { Search, Filter } from 'lucide-react'

export default function ArtikelListPage() {
  const allArticles = getAllArticles()
  const categories = getCategories()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const filtered = useMemo(() => {
    let list: Article[] = allArticles
    if (activeCategory !== 'Semua') {
      list = list.filter(a => a.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.keywords.join(' ').toLowerCase().includes(q)
      )
    }
    return list
  }, [allArticles, activeCategory, search])

  const featured = allArticles.filter(a => a.featured).slice(0, 1)[0]
  const gridArticles = filtered.filter(a => a.slug !== featured?.slug)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0A6E7C] to-[#00C9B7]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-white/90 text-sm mb-6">
              <span className="w-2 h-2 bg-[#00C9B7] rounded-full animate-pulse" />
              Update setiap 3 hari • SEO • Edukasi RS
            </div>
            <h1 className="heading-1 text-white mb-4">
              Artikel & <span className="text-[#00C9B7]">Insight</span> Hosp-IT
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Panduan praktis SIMRS, RIS PACS, SatuSehat, BPJS & infrastruktur medis — ditulis untuk direktur, IT RS, dan tim pengadaan agar keputusan digitalisasi lebih tepat.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Cari artikel: mis. SIMRS, SatuSehat, Modular OT..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#00C9B7] focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-[72px] z-30 bg-white/80 backdrop-blur border-b border-[#E2E8F0] py-4">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 overflow-x-auto">
            <span className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] shrink-0"><Filter className="w-4 h-4" /> Filter:</span>
            <button
              onClick={() => setActiveCategory('Semua')}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === 'Semua' ? 'bg-[#0A6E7C] text-white shadow-md' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
            >
              Semua ({allArticles.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-[#0A6E7C] text-white shadow-md' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#64748B]">Tidak ada artikel untuk filter ini.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('Semua') }} className="mt-4 btn-primary">Reset Filter</button>
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && activeCategory === 'Semua' && !search && (
                  <div className="mb-12">
                    <h2 className="text-sm font-bold tracking-widest uppercase text-[#0A6E7C] mb-4">Featured</h2>
                    <ArticleCard article={featured} featured />
                  </div>
                )}

                {/* Grid */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading-3 text-[#1E293B]">
                      {search ? `Hasil untuk "${search}"` : activeCategory === 'Semua' ? 'Semua Artikel' : `Kategori: ${activeCategory}`}
                    </h2>
                    <span className="text-sm text-[#94A3B8]">{filtered.length} artikel</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(search || activeCategory !== 'Semua' ? filtered : gridArticles).map(article => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white border-t border-[#E2E8F0]">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="heading-3 text-[#1E293B] mb-3">Butuh konsultasi spesifik untuk RS Anda?</h3>
            <p className="text-[#64748B] mb-6">Tim Hosp-IT siap assessment gratis: SIMRS, RIS PACS, hingga MOT & gas medis.</p>
            <a href="https://wa.me/6285111244364?text=Halo%20Hosp-IT,%20saya%20baca%20artikel%20dan%20ingin%20konsultasi" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Konsultasi Gratis via WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
