import { Star, Building2, MapPin } from 'lucide-react'

export default function Portfolio() {
  return (
    <section id="portofolio" className="relative py-24 bg-[#F8FAFC] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="badge badge-success mb-4">Terbukti & Terpercaya</span>
          <h2 className="heading-2 text-[#1E293B] mb-4">
            30+ <span className="text-gradient">Referensi Rumah Sakit</span>
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Dipercaya oleh RSUD, RS Swasta, dan RS Khusus di berbagai wilayah Indonesia. 
            Setiap implementasi adalah bukti komitmen kami terhadap kualitas.
          </p>
        </div>

        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#0A6E7C] rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Star className="w-8 h-8 text-[#00C9B7] mx-auto" />
              <div className="text-3xl font-bold text-white">30+</div>
              <div className="text-white/70 text-sm">Rumah Sakit Aktif</div>
            </div>
            <div className="space-y-2">
              <Building2 className="w-8 h-8 text-[#00C9B7] mx-auto" />
              <div className="text-3xl font-bold text-white">5</div>
              <div className="text-white/70 text-sm">Wilayah Indonesia</div>
            </div>
            <div className="space-y-2">
              <MapPin className="w-8 h-8 text-[#00C9B7] mx-auto" />
              <div className="text-3xl font-bold text-white">90</div>
              <div className="text-white/70 text-sm">Hari Rata-rata Go-Live</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
