import { Link } from 'react-router-dom'
import { ArrowRight, Calendar } from 'lucide-react'
import { getAllArticles } from '@/data/articles'
import ArticleCard from '@/components/ArticleCard'

export default function ArtikelTeaser() {
  const articles = getAllArticles().slice(0, 3)
  if (articles.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="badge badge-accent mb-3">Insight Terbaru</span>
            <h2 className="heading-2 text-[#1E293B]">
              Artikel & <span className="text-gradient">Wawasan RS</span>
            </h2>
            <p className="body-large mt-3 max-w-xl">
              Update setiap 3 hari — panduan SIMRS, SatuSehat, BPJS & infra yang langsung bisa Anda pakai untuk keputusan.
            </p>
          </div>
          <Link to="/artikel" className="btn-outline group">
            Lihat Semua Artikel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map(a => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#64748B]">
          <Calendar className="w-4 h-4" /> Artikel baru terbit otomatis setiap 3 hari • 07:00 WIB
        </div>
      </div>
    </section>
  )
}
