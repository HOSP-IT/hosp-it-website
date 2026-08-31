import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { CATEGORY_COLOR, type Article } from '@/data/articles'

export default function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  if (featured) {
    return (
      <Link to={`/artikel/${article.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] card-hover">
          <div className="relative h-64 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.coverAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${CATEGORY_COLOR[article.category] || 'bg-[#0A6E7C] text-white'}`}>
                {article.category}
              </span>
              {article.featured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#00C9B7] text-white">Featured</span>
              )}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-[#1E293B] line-clamp-2 group-hover:text-[#0A6E7C] transition-colors">
              {article.title}
            </h3>
            <p className="mt-3 text-sm text-[#64748B] line-clamp-2 leading-relaxed">{article.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readingTime} menit</span>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-[#0A6E7C] group-hover:gap-2 transition-all">
                Baca <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link to={`/artikel/${article.slug}`} className="group block h-full">
      <article className="h-full flex flex-col overflow-hidden rounded-xl bg-white border border-[#E2E8F0] card-hover">
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={article.coverImage}
            alt={article.coverAlt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLOR[article.category] || 'bg-[#0A6E7C] text-white'}`}>
              {article.category}
            </span>
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col">
          <h3 className="text-base font-bold text-[#1E293B] line-clamp-2 group-hover:text-[#0A6E7C] transition-colors">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-[#64748B] line-clamp-2 flex-1">{article.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(article.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readingTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
